const express = require('express');
const channelController = require('../controllers/channelController');
const authController = require('../controllers/authController');
const channelRouter = express.Router();

const messageRouter = require('./messageRouter');

channelRouter.use('/:channelId/messages', messageRouter);

channelRouter.use(authController.protect);

channelRouter.post('/', channelController.createChannel);

channelRouter
  .route('/:channelId')
  .delete(channelController.deleteChannel)
  .get(channelController.getChannel)
  .patch(channelController.editChannel);

channelRouter.get('/me/my-channels', channelController.getMyChannels);

channelRouter.delete(
  '/:channelId/members/exit',
  channelController.exitSelfFromUser
);

channelRouter
  .route('/:channelId/members')
  .post(channelController.addUserToChannel)
  .get(channelController.getChannelMembers);
channelRouter.delete(
  '/:channelId/members/:memberId',
  channelController.removeUserFromChannel
);

module.exports = channelRouter;
