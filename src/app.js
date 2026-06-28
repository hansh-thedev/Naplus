const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const tourRouter = require("./routes/tourRoutes");

app.use("/api/v1/tours", tourRouter);

module.exports = app;