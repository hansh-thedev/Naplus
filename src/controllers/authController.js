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
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    photo,
    passwordChangedAt,
    role,
  } = req.body;
  const body = {
    name,
    email,
    password,
    photo,
    passwordConfirm,
    passwordChangedAt,
    role,
  };
  const newUser = await User.create(body);

  //==> JWT
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
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));
  // Checking if user exists
  const user = await User.findOne({ email }).select("+password");
  //   comparing password : if now user second check will not run
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  const token = createJWTToken(user._id);
  res.status(201).json({
    status: "success",
    token,
  });
});
