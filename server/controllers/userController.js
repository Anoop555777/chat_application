const ChannelMember = require('../models/channelMemberModel');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const cloudinary = require('./../cloudinary');

exports.getAllChannelMembers = catchAsync(async (req, res, next) => {
  const memberships = await ChannelMember.find({ user: req.user._id });

  // channelIds that user is member of
  const channelIds = memberships.map((member) => member.channel);

  //all members in those channels

  const allMembers = await ChannelMember.find({
    channel: { $in: channelIds },
  }).populate({
    path: 'user',
    select: 'fullname email avatar',
  });

  const unique = {};

  allMembers.forEach((member) => {
    if (member.user._id.toString() !== req.user._id.toString())
      unique[member.user._id] = member.user;
  });

  res.status(200).json({
    status: 'success',
    members: Object.values(unique),
  });
});

exports.userMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new AppError('No user found with that ID', 404));

  // ✅ delete old image from cloudinary if exists and new one is uploaded
  if (
    req.file &&
    user.avatar?.public_id &&
    user.avatar?.public !== 'default-user'
  ) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  if (req.file) {
    user.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    if (req.body.fullname) user.fullname = req.body.fullname;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: 'success',
      user,
    });
  }
});
