const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
      minlength: [3, 'first name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      validate: [validator.isEmail, 'Please provide correct email'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: [8, 'password must be at least 8 characters long'],
      select: false,
      validate: {
        validator: function (value) {
          // At least 1 number, 1 special character, and 1 uppercase letter
          return /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/.test(value);
        },
        message:
          'Password must contain at least one uppercase letter, one number, and one special character',
      },
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'password must be same',
      },
    },
    avatar: {
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/dnwwado7g/image/upload/v1756380909/ajchat/default-user.jpg',
      },
      public_id: {
        type: String,
        default: 'default-user',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['online', 'offline', 'away'],
        message: ' offine,online,away are valid status',
      },
      default: 'offline',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: 'Boolean',
      default: false,
    },
    passwordResetToken: String,
    passwordExpireToken: Date,
    passwordChangedAt: Date,
    verifiedToken: String,
    // isProfileComplete: {
    //   type: 'Boolean',
    //   default: false,
    // },
  },

  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() + 1000;
  next();
});

/////////
//Instant method
/////////

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordExpireToken = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.correctPassword = async function (
  candidateKey,
  userPassword
) {
  return await bcrypt.compare(candidateKey, userPassword);
};

userSchema.methods.createVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  this.verifiedToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  return verifyToken;
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changeTime;
  }

  //if password is not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// lastname: {
//   type: String,
//   required: [true, 'lastname is required'],
//   trim: true,
//   minlength: [3, 'last name must be at least 3 characters long'],
// },
// phone: {
//   type: "String",
//   required: [true, "Phone number is required"],
//   unique: true,
//   match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (use +91)"],
//   select: false, // Do not return phone number in queries by default
// },
