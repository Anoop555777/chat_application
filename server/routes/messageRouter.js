const express = require('express');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const messageRouter = express.Router({ mergeParams: true });

messageRouter.use(authController.protect);

messageRouter
  .route('/')
  .post(messageController.sendMessage)
  .get(messageController.getMessages);

messageRouter.delete('/:messageId', messageController.deleteMessage);

module.exports = messageRouter;
