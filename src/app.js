const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

// ==> MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());
// ==> IMPORTS
const authRouter = require("./routes/authRoutes");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./controllers/errorController");

//==> ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handling unhandled routes.
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// GLOBAL ERROR HANDLING
app.use(errorHandler);

module.exports = app;
