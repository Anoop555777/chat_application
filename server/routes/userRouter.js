const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const upload = require('../utils/multerCloudinary');

const router = express.Router();

router.use(authController.protect);

router.get('/getAllChannelMembers', userController.getAllChannelMembers);
router.patch('/updateMe', upload.single('avatar'), userController.userMe);

module.exports = router;
