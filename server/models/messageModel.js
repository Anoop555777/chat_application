const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    minlength: [1, 'Message cannot be empty'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: 'sender', select: 'fullname' }).sort({
    createdAt: 1,
  });

  next();
});

messageSchema.index({ channel: 1, createdAt: -1 }); // for recent messages per channel

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
