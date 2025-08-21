const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
      unique: true,
    },
    description: { type: String, trim: true },
    isPrivate: { type: Boolean, default: false },
    isDirect: { type: Boolean, default: false }, // true for one-to-one DM
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

channelSchema.virtual('messages', {
  ref: 'Message',
  foreignField: 'channel',
  localField: '_id',
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
