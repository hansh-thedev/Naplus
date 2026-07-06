const express = require("express");
const {
  getAlltours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
} = require("../controllers/tourController");
const { aliasTop5CheapTours } = require("../middlewares/tourMiddleware");

const router = express.Router();

router.route("/top-5-cheap").get(aliasTop5CheapTours, getAlltours);
router.route("/tour-stats").get(getTourStats);

router.route("/").get(getAlltours).post(createTour);
router.route("/:tourId").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
