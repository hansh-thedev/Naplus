const express = require("express");
const { getAlltours } = require("../controllers/tourController");

const router = express.Router();
router.route("/").get(getAlltours)


module.exports = router;