const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const SentOTP = require('../utils/sentOtp');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');
const Email = require('../utils/email');
const { decode } = require('punycode');
// const otpStore = {};

const tokenGenerater = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const sendToken = (user, statusCode, res, message = '') => {
  const token = tokenGenerater(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  res.locals.user = user;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  sendVerifyToken(newUser, res, next);
});

exports.resentverification = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Email is required', 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError('User not found', 404));

  sendVerifyToken(user, res, next);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if user have enter email and password

  if (!email || !password)
    next(new AppError('please enter email and password', 401));

  //check if the user exist and password is correct

  const user = await User.findOne({ email }).select('+password +role');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('please correct your email and password', 401));

  if (!user.isVerified)
    return next(
      new AppError('you are not verified please check you email', 400)
    );

  sendToken(user, 200, res, 'you are successfully logged in');
});

async function sendVerifyToken(user, res, next) {
  const verifiedToken = user.createVerifyToken();

  await user.save({ validateBeforeSave: false });

  // const sendVerifyToken = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/auth/verification/${verifiedToken}`;

  const sendVerifyToken = `http://localhost:5173/verification/${verifiedToken}`;

  try {
    await new Email(user, sendVerifyToken).sendVerify();
    res.status(200).json({
      status: 'success',
      message: 'verification link  sent to email please verify first',
    });
  } catch (err) {
    user.verifiedToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
}

exports.signout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success', user: null });
};

exports.verification = catchAsync(async (req, res, next) => {
  const { verify_token } = req.params;

  if (!verify_token)
    return next(
      new AppError(
        'Sorry no token please signin again of look to you email',
        404
      )
    );

  const hashedToken = crypto
    .createHash('sha256')
    .update(verify_token)
    .digest('hex');

  const user = await User.findOne({
    verifiedToken: hashedToken,
  });
  if (!user) {
    return next(new AppError('Token in invlid or expired', 400));
  }

  user.isVerified = true;
  user.verifiedToken = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res, 'you are verified');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('please enter email and password', 400));

  const user = User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(
      new AppError('either user not exist or password is incorrect', 404)
    );

  if (!user.isVerified)
    return next(
      new AppError('you are not verified please check you email', 400)
    );

  sendToken(user, 200, res);
});

// exports.sendOtp = catchAsync(async (req, res, next) => {
//   const { phone } = req.body;
//   if (!phone) return next(new AppError('Phone number is required', 400));
//   // Generate a 6-digit OTP
//   const otp = Math.trunc(100000 + Math.random() * 900000).toString();

//   otpStore[phone] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // Store OTP in memory (for demo purposes) // OTP valid for 10 minutes

//   const message = `Your OTP is ${otp}. It is valid for 10 minutes.`;
//   const sentOtp = new SentOTP(phone, process.env.TWILIO_PHONE_NUMBER, message);

//   try {
//     await sentOtp.createMessage();
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     delete otpStore[phone]; // Clean up if sending fails
//     return next(
//       new AppError('Failed to send OTP. Please try again later.', 500)
//     );
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'OTP sent successfully!',
//   });
// });
// exports.verifyOtp = catchAsync(async (req, res, next) => {
//   const { phone, otp } = req.body;
//   if (!phone || !otp)
//     return next(new AppError('Phone and OTP are required', 400));
//   const otpData = otpStore[phone];

//   if (!otpData) return next(new AppError('OTP not found or already used', 400));

//   if (otpData.expires < Date.now())
//     return next(new AppError('OTP has expired', 400));

//   if (otpData.otp !== otp) return next(new AppError('Invalid OTP', 400));

//   const generatePhoneHash = crypto
//     .createHash('sha256')
//     .update(phone)
//     .digest('hex');

//   let user = await User.findOne({ phone: generatePhoneHash }).select('+phone');

//   if (!user) {
//     user = new User({ isVerified: true, phone: generatePhoneHash });
//     await user.save({ validateBeforeSave: false });
//   } else {
//     await User.findByIdAndUpdate(
//       user._id,
//       { isVerified: true },
//       { new: true, runValidators: true }
//     );
//   }

//   delete otpStore[phone]; // Remove OTP after successful verification

//   sendToken(user, 200, res);
// });

// exports.updateProfile = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   if (user.isProfileComplete)
//     res.status(200).json({
//       status: 'success',
//       user,
//     });

//   if (!user) return next(new AppError('Please signin first', 404));

//   req.body.isProfileComplete = true;
//   const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     status: 'success',
//     updatedUser,
//   });
// });

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  //1 check if token is in header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new AppError('Please log in first', 401));

  //2 verification of the token

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3 check is the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) return next(new AppError('User no longer exists', 401));

  //4 check if the user have changed the password after logIn

  if (freshUser.changePasswordAfter(decoded.iat))
    return new AppError('user have change the password login again', 401);

  req.user = freshUser;
  next();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //find the user with the help of email
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('no email found for this user ', 400));

  // generate a ramdon route token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email

  const resetURL = `http://localhost:5173/resetpassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.reset_token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpireToken: { $gt: Date.now() }, //checked if token is expired or not
  });

  if (!user) {
    return next(new AppError('Token in invalid or expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordExpireToken = undefined;
  await user.save();
  //update change passwordAt property

  //log the user in
  sendToken(user, 200, res, 'Password has been reset');
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token

      const decoded = await util.promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // 3) Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN U

      res.status(200).json({
        status: 'success',
        user: currentUser,
      });
    } catch (err) {
      return next();
    }
  }
  next();
};
