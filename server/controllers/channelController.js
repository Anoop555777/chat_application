const catchAsync = require('../utils/catchAsync');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const ChannelMember = require('../models/channelMemberModel');
const cloudinary = require('./../cloudinary');

exports.createChannel = catchAsync(async (req, res, next) => {
  const channelData = {};

  const { members } = req.body;
  if (!Array.isArray(members) || members.length < 1)
    return next(
      new AppError('At least one member is required to create a channel', 400)
    );

  // Ensure creator is in the members list
  if (!members.includes(req.user.email)) members.push(req.user.email);

  const user = await User.find({ email: { $in: members } }).lean();

  if (!user || user.length != members.length)
    return next(new AppError('one or more member is missing', 404));

  //create channel
  channelData.name = req.body.name;
  if (req.body.description) channelData.description = req.body.description;
  channelData.isPrivate = req.body.isPrivate || channelData.isPrivate || false;
  channelData.isDirect = members.length == 2 || false;
  channelData.createdBy = req.user._id;

  const channel = await Channel.create(channelData);

  const channelMemberData = user.map((data) => ({
    channel: channel._id,
    user: data._id,
    role:
      data._id.toString() == req.user._id.toString() || members.length == 2
        ? 'admin'
        : 'member',
  }));

  await ChannelMember.insertMany(channelMemberData);

  res.status(201).json({
    status: 'success',
    message: 'Channel created successfully',
    data: {
      channel,
    },
  });
});

exports.getMyChannels = catchAsync(async (req, res, next) => {
  const membership = await ChannelMember.find({
    user: req.user._id,
  })
    .populate({
      path: 'channel',
      select: 'name description avatar isPrivate isDirect ',
    })
    .lean();

  let channels = membership.map((m) => m.channel);
  res.status(200).json({
    status: 'success',
    channels,
  });
});

exports.addUserToChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  const { members } = req.body;

  if (!channelId) return next(new AppError('Channel ID is required', 400));
  if (members.length == 0)
    return next(new AppError('Members are is required', 400));

  const adminUser = await ChannelMember.findOne({
    user: req.user._id,
    channel: channelId,
    role: 'admin',
  });

  const channel = await Channel.exists({ _id: channelId });
  if (!channel) return next(new AppError('Channel not found', 404));

  if (!adminUser)
    return next(
      new AppError('You are not authorized to add members to this channel', 403)
    );

  const users = await User.find({ email: { $in: members } });
  if (!users || users.length != members.length)
    return next(new AppError('one or more member is missing', 404));

  const channelMemberData = users.map((user) => ({
    channel: channelId,
    user: user._id,
  }));

  await ChannelMember.insertMany(channelMemberData);

  res.status(200).json({
    status: 'success',
    message: 'User added to channel successfully',
    members: users,
  });
});

exports.removeUserFromChannel = catchAsync(async (req, res, next) => {
  const { channelId, memberId } = req.params;

  if (!channelId) return next(new AppError('Channel ID is required', 400));
  if (!memberId) return next(new AppError('Member ID is required', 400));

  // Check if the user is an admin of the channel
  const adminUser = await ChannelMember.exists({
    user: req.user._id,
    channel: channelId,
    role: 'admin',
  });

  if (!adminUser)
    return next(
      new AppError(
        'You are not authorized to remove members from this channel',
        403
      )
    );

  const removed = await ChannelMember.findOneAndDelete({
    channel: channelId,
    user: memberId,
  });

  if (!removed) {
    return next(new AppError('User is not in this channel', 404));
  }

  //check if channel have only one member
  const remainingMembers = await ChannelMember.countDocuments({
    channel: channelId,
  });

  if (remainingMembers <= 1) {
    await Promise.all([
      ChannelMember.deleteMany({ channel: channelId }),
      Channel.findByIdAndDelete(channelId), // Delete channel if only one member left
    ]);
  }

  res.status(204).json({
    status: 'success',
    message: 'User removed from channel successfully',
    data: null,
  });
});

exports.getChannelMembers = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  const members = await ChannelMember.find({ channel: channelId }).populate({
    path: 'user',
    select: 'fullname email avatar',
  });

  if (!members || members.length === 0)
    res.status(200).json({
      status: 'success',
      members: [],
    });

  const users = members.map((member) => {
    return {
      ...member.user._doc,
      role: member.role,
    };
  });

  res.status(200).json({
    status: 'success',
    members: users,
  });
});

exports.deleteChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  if (!channelId) return next(new AppError('Channel ID is required', 400));

  const channel = await Channel.findById(channelId);
  if (!channel) return next(new AppError('Channel not found', 404));

  // Check if the user is an admin of the channel
  const adminUser = await ChannelMember.findOne({
    user: req.user._id,
    channel: channelId,
    role: 'admin',
  });

  if (!adminUser)
    return next(
      new AppError(
        'You are not admin so no authorization to delete this channel',
        403
      )
    );

  await ChannelMember.deleteMany({ channel: channelId });
  await Channel.findByIdAndDelete(channelId);

  res.status(204).json({
    status: 'success',
    message: 'Channel deleted successfully',
    data: null,
  });
});

exports.getChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  if (!channelId) return next(new AppError('Channel ID is required', 400));

  const channelExistWithUser = await ChannelMember.findOne({
    channel: channelId,
    user: req.user._id,
  });

  if (!channelExistWithUser)
    return next(new AppError('You are not a member of this channel', 403));
  // Fetch channel details along with messages
  let channel = await Channel.findById(channelId).populate('messages');
  if (!channel) return next(new AppError('Channel not found', 404));

  res.status(200).json({
    status: 'success',
    channel,
    role: channelExistWithUser.role,
  });
});

exports.exitSelfFromUser = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

  const channel = await Channel.findById(channelId);
  if (!channel) return next(new AppError('Channel not found', 404));

  const member = await ChannelMember.exists({
    channel: channelId,
    user: req.user._id,
  });

  if (!member) return new AppError('You are not a member of this channel', 403);

  await ChannelMember.deleteOne({
    channel: channelId,
    user: req.user._id,
  });

  const members = await ChannelMember.countDocuments({
    channel: channelId,
  });

  if (members <= 1) {
    await ChannelMember.deleteMany({
      channel: channelId,
    });
    await Channel.findByIdAndDelete(channelId);
  }

  res.status(204).json({
    status: 'success',
    message: 'You have left the channel successfully',
    data: null,
  });
});

exports.editChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  const channel = await Channel.findById(channelId);
  if (!channel) return next(new AppError('Channel not found', 404));

  let deleteOldAvatarPromise = Promise.resolve();

  if (
    req.file &&
    channel?.avatar?.public_id &&
    channel?.avatar?.public_id !== 'default-user'
  ) {
    deleteOldAvatarPromise = cloudinary.uploader.destroy(
      channel.avatar.public_id
    );
  }

  if (req.file) {
    channel.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  if (req.body.name) channel.name = req.body.name;
  if (req.body.description) channel.description = req.body.description;

  await Promise.all([deleteOldAvatarPromise, channel.save()]);

  res.status(200).json({
    status: 'success',
    message: 'Channel updated successfully',
    channel,
  });
});
