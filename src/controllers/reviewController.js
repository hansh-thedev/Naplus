const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/*==>  
    desc: Create a new review
    route: [POST]:   /reviews
    access: private 
 <== */

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  const newReview = await Review.create(req.body);
  if (!newReview) return next(new AppError("Error cannot create a review"));
  res.status(201).json({
    status: "success",
    data: { review: newReview },
  });
});

/*==>  
    desc: Fetch all reviews
    route: [GET]:   /reviews
    access: private 
 <== */

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

/*==>  
    desc: Fetch review 
    route: [GET]:   /reviews/:tourID
    access: private 
 <== */

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ tour: req.params.tourId });
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

/*==>  
    desc: Delete a review 
    route: [DELETE]:   /reviews/:reviewId
    access: private 
 <== */

exports.deleteReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.findByIdAndDelete(req.params.reviewId);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

/*==>  
    desc: Update a review 
    route: [Patch]:   /reviews/:reviewId
    access: private 
 <== */

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { review },
  });
});
