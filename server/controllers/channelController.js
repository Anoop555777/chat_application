const catchAsync = require('../utils/catchAsync');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const ChannelMember = require('../models/channelMemberModel');

exports.createChannel = catchAsync(async (req, res, next) => {
  channelData = {};

  const { members } = req.body;
  if (!Array.isArray(members) || members.length < 1)
    return next(
      new AppError('At least one member is required to create a channel', 400)
    );

  // Ensure creator is in the members list
  if (!members.includes(req.user.email)) members.push(req.user.email);

  const user = await User.find({ email: { $in: members } });

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
  }).populate('channel');
  let channels = [];
  if (membership || membership.length > 0)
    channels = membership.map((m) => m.channel);
  res.status(200).json({
    status: 'success',
    channels,
  });
});

exports.addUserToChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  const { member } = req.body;

  if (!channelId) return next(new AppError('Channel ID is required', 400));
  if (!member) return next(new AppError('Member ID is required', 400));

  const adminUser = await ChannelMember.findOne({
    user: req.user._id,
  });

  if (!adminUser)
    return next(
      new AppError('You are not authorized to add members to this channel', 403)
    );

  const user = await User.findById(member);
  if (!user) return next(new AppError('User not found', 404));
  if (user && !user.isVerified && !user.isProfileComplete)
    return next(
      new AppError('User must be verified and have a complete profile', 400)
    );

  const channel = await Channel.findById(channelId);

  if (!channel) return next(new AppError('Channel not found', 404));

  const channelMember = await ChannelMember.find({
    channel: channelId,
    user: member,
  });

  if (channelMember.length > 0)
    return next(new AppError('User is already a member of this channel', 400));

  const newMember = await ChannelMember.create({
    channel: channelId,
    user: user._id,
    role: 'member', // Default role, can be changed later
  });

  res.status(200).json({
    status: 'success',
    message: 'User added to channel successfully',
    data: {
      member: newMember,
    },
  });
});

exports.removeUserFromChannel = catchAsync(async (req, res, next) => {
  const { channelId, memberId } = req.params;

  if (!channelId) return next(new AppError('Channel ID is required', 400));
  if (!memberId) return next(new AppError('Member ID is required', 400));

  //if channel and member exists
  const channelExists = await ChannelMember.findOne({
    channel: channelId,
    user: memberId,
  });

  if (!channelExists)
    return next(new AppError('Channel or member not found', 404));

  // Check if the user is trying to remove themselves
  if (req.user._id.toString() === memberId) {
    await ChannelMember.findByIdAndDelete(channelExists._id);
  } else {
    // Check if the user is an admin of the channel
    const adminUser = await ChannelMember.findOne({
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

    await ChannelMember.findByIdAndDelete(channelExists._id);
  }

  //check if channel have only one member
  const remainingMembers = await ChannelMember.countDocuments({
    channel: channelId,
  });

  if (remainingMembers <= 1) {
    await ChannelMember.deleteMany({ channel: channelId });
    await Channel.findByIdAndDelete(channelId); // Delete channel if only one member left
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
    select: 'firstname lastname avatar',
  });
  if (!members || members.length === 0)
    return next(new AppError('No members found for this channel', 404));

  res.status(200).json({
    status: 'success',
    members,
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
      new AppError('You are not authorized to delete this channel', 403)
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
  const channel = await Channel.findById(channelId).populate('messages');
  if (!channel) return next(new AppError('Channel not found', 404));

  res.status(200).json({
    status: 'success',
    channel,
  });
});
