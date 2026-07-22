const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router
  .route("/me")
  .get(
    authMiddleware.protectAuth,
    authMiddleware.getMe,
    userController.getUser,
  );

router.route("/").get(userController.getAllUsers);
router.route("/:userId").get(userController.getUser);
module.exports = router;
