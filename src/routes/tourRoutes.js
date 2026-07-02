const express = require("express");
const {
  getAlltours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");

const router = express.Router();

router.route("/").get(getAlltours).post(createTour);
router.route("/:tourId").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
