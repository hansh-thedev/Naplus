const express = require("express");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });
router.route("/").get(reviewController.getAllReviews).post(
  authMiddleware.protectAuth,
  authMiddleware.restrictTo("user"), // only users are allowed to create reviews
  reviewController.createReview,
);

router
  .route("/:reviewId")
  .patch(
    authMiddleware.protectAuth,
    authMiddleware.restrictTo("user"),
    reviewController.updateReview,
  )
  .delete(
    authMiddleware.protectAuth,
    authMiddleware.restrictTo("user"),
    reviewController.deleteReview,
  );

// route for fetching reviews belonging to tour
router.route("/:tourId").get(reviewController.getReviews);
module.exports = router;
