const express = require('express');
const channelController = require('../controllers/channelController');
const authController = require('../controllers/authController');
const channelRouter = express.Router();

const messageRouter = require('./messageRouter');

channelRouter.use('/:channelId/messages', messageRouter);

channelRouter.use(authController.protect);

channelRouter.post('/', channelController.createChannel);
channelRouter.delete('/:channelId', channelController.deleteChannel);

channelRouter.get('/:channelId', channelController.getChannel);
channelRouter.get('/me/my-channels', channelController.getMyChannels);

channelRouter
  .route('/:channelId/members')
  .post(channelController.addUserToChannel)
  .get(channelController.getChannelMembers);
channelRouter.delete(
  '/:channelId/members/:memberId',

  channelController.removeUserFromChannel
);
module.exports = channelRouter;
