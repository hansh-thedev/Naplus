const express = require("express");
const { getAlltours, getTour } = require("../controllers/tourController");

const router = express.Router();

router.route("/").get(getAlltours);
router.route("/:tourId").get(getTour);

module.exports = router;