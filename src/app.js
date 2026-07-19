const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const app = express();

// ==> MIDDLEWARES
app.use(helmet()); // security http header
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP, Please try again after 1 hour",
});
app.use("/api", limiter);
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize()); // sanitize nosql query injection
app.use(
  hpp({
    whitelist: [
      "duration",
      "price",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
    ],
  }),
); //prevent query parameter pollution
// ==> IMPORTS

const authRouter = require("./routes/authRoutes");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./controllers/errorController");

// app.all("*", (req, res, next) => {
//   console.log(req.headers);
//   next();
// });

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
