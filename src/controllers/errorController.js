const AppError = require("../utils/appError");
const sendErrorDevelopment = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProduction = function (err, res) {
  // send operational trusted error to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // not leaking unknown errors to client.
    console.log("ERROR !", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

//=> HANDLING database errors
const handleCastError = function (err) {
  const message = `Invallid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsError = function (err) {
  // const value = err.errmsg.match();
  const value = "errrrrrrrrr";
  const message = `Duplicate field value : ${value}. Please use another value`;
  return new AppError(message, 409);
};
const handleValidationError = function (err) {
  const er = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data : ${er.join(". ")}`;
  return new AppError(message, 400);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // Handling cast error and invalid id errors:
    if (err.name === "CastError") {
      error = handleCastError(err);
    }
    // Handling mongoose errors.
    if (err.code === 11000) {
      error = handleDuplicateFieldsError(err);
    }
    if (err.name === "ValidationError") {
      error = handleValidationError(err);
    }
    sendErrorProduction(error, res);
  }
};

module.exports = errorHandler;
