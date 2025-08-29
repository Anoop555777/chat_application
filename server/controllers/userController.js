const ChannelMember = require('../models/channelMemberModel');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const cloudinary = require('./../cloudinary');

exports.getAllChannelMembers = catchAsync(async (req, res, next) => {
  const memberships = await ChannelMember.find({ user: req.user._id });
  if (!memberships.length)
    return res.status(200).json({
      status: 'success',
      members: [],
    });

  // channelIds that user is member of
  const channelIds = memberships.map((member) => member.channel);

  //all members in those channels

  const allMembers = await ChannelMember.find({
    channel: { $in: channelIds },
    user: { $ne: req.user._id },
  }).populate({
    path: 'user',
    select: 'fullname email avatar',
  });

  const uniqueUsers = Object.values(
    allMembers.reduce((acc, member) => {
      acc[member.user._id] = member.user;
      return acc;
    }, {})
  );

  res.status(200).json({
    status: 'success',
    members: uniqueUsers,
  });
});

exports.userMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new AppError('No user found with that ID', 404));

  let deleteOldAvatarPromise = Promise.resolve();
  // ✅ delete old image from cloudinary if exists and new one is uploaded

  if (req.file) {
    if (
      req.file &&
      user.avatar?.public_id &&
      user.avatar?.public_id !== 'default-user'
    ) {
      deleteOldAvatarPromise = cloudinary.uploader.destroy(
        user.avatar.public_id
      );
    }
    user.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  if (req.body.fullname) user.fullname = req.body.fullname;

  await Promise.all([deleteOldAvatarPromise, user.save()]);

  return res.status(200).json({
    status: 'success',
    user,
  });
});
