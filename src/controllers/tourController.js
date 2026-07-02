const Tour = require("../models/tourModel");

/*==>  
    desc: Fetch all tours from DB
    route: [GET]:   /tours 
    access: public 
 <== */
const getAlltours = async (req, res, next) => {
  try {
    //==> Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["limit", "page", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //==> Converting query string to mongoDB filter query
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`,
    );

    console.log(JSON.parse(queryString));
    const query = Tour.find(JSON.parse(queryString));

    const tours = await query;
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: { tours: tours },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Error! Cannot fetch tours",
    });
  }
};

/*==>  
    desc: Fetch single tour by Id
    route: [GET]:   /tours/:tourId 
    access: private 
 <== */
const getTour = async (req, res, next) => {
  const tourId = req.params.tourId;
  try {
    const tour = await Tour.findById(tourId);
    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Error! Cannot fetch tour",
    });
  }
};

/*==>  
    desc: Create a new tour
    route: [POST]:   /tours 
    access: private 
 <== */
const createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Error! Cannot create a new tour",
    });
  }
};

/*==>  
    desc: Update a tour by Id
    route: [PATCH]:   /tours/:ID 
    access: private 
 <== */
const updateTour = async (req, res, next) => {
  const tourId = req.params.tourId;
  if (!tourId) throw new Error("Invalid Id");
  try {
    const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
      returnDocument: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

/*==>  
    desc: Delete a tour by Id
    route: [DELETE]:   /tours/:ID 
    access: private 
 <== */

const deleteTour = async (req, res, next) => {
  const tourId = req.params.tourId;
  try {
    await Tour.findByIdAndDelete(tourId);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "success",
      message: error,
    });
  }
};

module.exports = { getAlltours, updateTour, getTour, createTour, deleteTour };
