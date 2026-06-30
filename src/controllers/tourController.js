/*==>  
    desc: Fetch all tours from DB
    route: [GET]:   /tours 
    access: public 
 <== */
const getAlltours = (req, res, next) => {
  res.json({
    status: "success",
    message: "All tours fetched successfully",
  });
};

/*==>  
    desc: Update a tour by Id
    route: [PATCH]:   /tours/:ID 
    access: private 
 <== */
const updateTour = (req, res, next) => {
  res.json({
    status: "success",
    message: "Tour updated successfully",
  });
};

/*==>  
    desc: Delete a tour by Id
    route: [DELETE]:   /tours/:ID 
    access: private 
 <== */

const deleteTour = (req, res, next) => {
  res.json({
    status: "success",
    data: null,
  });
};

/*==>  
    desc: Fetch single tour by Id
    route: [GET]:   /tours/:tourId 
    access: private 
 <== */
const getTour = (req, res, next) => {
  const tourId = req.params.tourId;
  res.status(200).json({
    status: "success",
    data: null,
  });
};

module.exports = { getAlltours, updateTour, getTour };
