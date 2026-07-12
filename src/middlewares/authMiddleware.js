const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.protectAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not authorized! Please signin", 401));
  }
  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user)
    next(new AppError("User belonging to this token doesn't exist!", 401));
  //Checking if user changed password
  const isChanged = user.passwordChanged(decoded.iat);
  if (isChanged) {
    next(
      new AppError(
        "Password has been changed recently! Please signin again",
        401,
      ),
    );
  }
  req.user = user;
  next();
});
