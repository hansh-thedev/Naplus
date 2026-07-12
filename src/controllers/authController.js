const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
/*==>  
    desc: Creating new user
    route: [POST]:  /auth/signup
    access: public 
 <== */

const createJWTToken = function (id) {
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, photo } = req.body;
  const body = { name, email, password, photo, passwordConfirm };
  const newUser = await User.create(body);

  //   JWT
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Checking if user exists
  const user = await User.find({ email });
  //   comparing password

  res.status(201).json({
    status: "success",
    data: { user },
  });
});
