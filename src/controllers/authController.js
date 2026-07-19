const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
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
const createSendJWTToken = function (user, statusCode, res) {
  const token = createJWTToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000, // 60 days
    ),
    secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("auth", token, cookieOptions);

  //removing password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    photo,
    role,
    passwordResetToken,
    passwordChangedAt,
    passwordResetExpires,
  } = req.body;
  const body = {
    name,
    email,
    password,
    photo,
    passwordConfirm,
    role,
    passwordResetToken,
    passwordChangedAt,
    passwordResetExpires,
  };
  const newUser = await User.create(body);

  //==> JWT
  createSendJWTToken(newUser, 201, res);
});

/*==>  
    desc: Sigin in user
    route: [POST]:  /auth/signin
    access: public 
 <== */
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
  createSendJWTToken(user, 200, res);
});

/*==>  
    desc: Handling forgot password
    route: [POST]:  /auth/forgotpassword
    access: public 
 <== */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) next(new AppError("TPlease provide email address", 400));
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError("There is no user with that email address", 404));
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a patch request with your new password to: ${resetUrl}.\n If you did't forgot your password, please ignore this email `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (only valid for 6 mins)",
      message,
    });
  } catch (error) {
    passwordResetToken = undefined;
    passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an error sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email",
  });
});

/*==>  
    desc:Reset password
    route: [PATCH]:  /auth/resetPassword/:token
    access: public 
 <== */
exports.resetPassword = async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Checking if password reset token expired.
  });
  if (!user) return next(new AppError("Token is invalid or expired", 400));
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  passwordResetToken = undefined;
  passwordResetExpires = undefined;
  await user.save();
};
