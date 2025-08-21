const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/isLoggedIn', authController.isLoggedIn);
router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/verification/:verify_token', authController.verification);
router.post('/resendVerification', authController.resentverification);
router.get('/signout', authController.signout);

// router.post("/send-otp", authController.sendOtp);
// router.post("/verify-otp", authController.verifyOtp);
// router.post(
//   '/update-profile',
//   authController.protect,
//   authController.updateProfile
// );

router.post('/forgetpassword', authController.forgetPassword);
router.patch('/resetpassword/:reset_token', authController.resetPassword);

module.exports = router;
