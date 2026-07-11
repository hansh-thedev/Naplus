class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // calling parent constructor : Error class accpeting only message
    this.statusCode = statusCode;
    // converting statusCode to string by wrapping in template string
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
