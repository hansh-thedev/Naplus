const Tour = require("../models/tourModel");

class APIFeatures {
  constructor(mongoQuery, queryString) {
    this.query = mongoQuery;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["limit", "page", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    //==> Converting query string to mongoDB filter query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this; // returning entire object so that we can chain methods
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // this.query = this.query.sort("-createdAt"); // @ INCOMPLETE
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // Excluding --v fields.
      this.query = this.query.select("-__v");
    }

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 30;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

/*==>  
    desc: Fetch all tours from DB
    route: [GET]:   /tours 
    access: public 
 <== */
const getAlltours = async (req, res, next) => {
  try {
    // EXECUTING QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
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
      message: error,
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
      status: "fail",
      message: error,
    });
  }
};
/*==>  
    desc: Get tour status
    route: [GET]:   /tour-stats
    access: private 
 <== */

const getTourStats = async (req, res, next) => {
  console.log("hitted");
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" }, // groups tours according to difficulty
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $avg: "$price" },
          maxPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

/*==>  
    desc: Get tour status
    route: [GET]:   /tour-stats
    access: private 
 <== */
const getMonthlyPlan = async (req, res, next) => {
  try {
    const year = req.params.year * 1;
    console.log(year);
    // @ INCOMPLETE
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates", // deconstruct array elements into individual seperate docs
      },
      {
        $match: {
          startDates: {
            $gte: { $toDate: new Date(`${year}-01-01`) },
            // $gte: { $toDate: new Date(`${year}-01-01`) }, // january 1st
            // $lte: { $toDate: new Date(`${year}-12-31`) }, // december 31st
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" }, // creating an array and pushing tours name in it
        },
      },
      {
        $addFields: {
          month: "_id", // adding new fields which displays months value
        },
      },
      {
        $project: {
          _id: 0, // excluding _id fields from data
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: { plan },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
module.exports = {
  getAlltours,
  updateTour,
  getTour,
  createTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
