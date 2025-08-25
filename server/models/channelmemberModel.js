const mongoose = require('mongoose');
const channelmemberSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.ObjectId, ref: 'Channel', required: true },

  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
  unreadCount: { type: Number, default: 0 },

  lastReadAt: { type: Date },
});

// prevent duplicate membership documents
channelmemberSchema.index({ channel: 1, user: 1 }, { unique: true });
// index to fetch channels by user fast
channelmemberSchema.index({ user: 1, channel: 1 });

const ChannelMember = mongoose.model('ChannelMember', channelmemberSchema);
module.exports = ChannelMember;
