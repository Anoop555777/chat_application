const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/getAllChannelMembers',
  authController.protect,
  userController.getAllChannelMembers
);

module.exports = router;
