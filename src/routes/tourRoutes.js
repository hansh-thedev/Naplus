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

const router = express.Router();

router.route("/top-5-cheap").get(aliasTop5CheapTours, getAlltours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(authMiddleware.protectAuth, getAlltours).post(createTour);
router.route("/:tourId").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
