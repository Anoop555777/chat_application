const ChannelMember = require('../models/channelMemberModel');
const catchAsync = require('../utils/catchAsync');

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
