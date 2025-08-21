const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Message = require('../models/messageModel');
const { getSocket } = require('../socket');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  const { content } = req.body;

  if (!channelId) return next(new AppError('Channel ID is required', 400));
  if (!content) return next(new AppError('Message content is required', 400));

  let message = await Message.create({
    content,
    sender: req.user._id,
    channel: channelId,
  });

  message = await Message.findById(message._id);

  getSocket().to(channelId).emit('newMessage', message);

  res.status(201).json({
    status: 'success',
    message: 'Message sent successfully',
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

  if (!channelId) return next(new AppError('Channel ID is required', 400));

  const messages = await Message.find({ channel: channelId });
  if (!messages || messages.length === 0)
    return next(new AppError('No messages found in this channel', 404));

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  if (!messageId) return next(new AppError('Message ID is required', 400));
  const message = await Message.findOneAndDelete({
    _id: messageId,
    sender: req.user._id,
  });

  if (!message) return next(new AppError('Message not found', 404));

  res.status(204).json({
    status: 'success',
    message: 'Message deleted successfully',
    data: null,
  });
});
