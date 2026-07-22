const express = require("express");
const {
  getAlltours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");
const authMiddleware = require("../middlewares/authMiddleware");
const { aliasTop5CheapTours } = require("../middlewares/tourMiddleware");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();
router.use("/:tourId/reviews", reviewRouter); // for this route we are using review router

router.route("/top-5-cheap").get(aliasTop5CheapTours, getAlltours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router
  .route("/")
  .get(authMiddleware.protectAuth, getAlltours)
  .post(
    authMiddleware.protectAuth,
    authMiddleware.restrictTo("guide", "lead-guide"),
    createTour,
  );
router
  .route("/:tourId")
  .get(getTour)
  .patch(
    authMiddleware.protectAuth,
    authMiddleware.restrictTo("admin", "guide"),
    updateTour,
  )
  .delete(
    authMiddleware.protectAuth,
    authMiddleware.restrictTo("admin", "guide"),
    deleteTour,
  );

module.exports = router;
