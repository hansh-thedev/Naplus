const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();

// ==> Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

const tourRouter = require("./routes/tourRoutes");

//==> ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", tourRouter);

module.exports = app;
