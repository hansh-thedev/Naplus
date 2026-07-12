const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
/*==>  
    desc: Fetch all users from DB
    route: [GET]:   /users/ 
    access: private 
 <== */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: { users },
  });
});
/*==>  
    desc: Fetch single tour by Id
    route: [GET]:   /tours/:tourId 
    access: private 
 <== */
exports.getUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) return next(new AppError("Please provide ID", 404));
  const user = await User.findById(userId);
  if (!user) return next(new AppError("No user found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
