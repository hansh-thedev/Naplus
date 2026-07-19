const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
router.route("/signup").post(authController.signup);
router.route("/signin").post(authController.signin);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
module.exports = router;
