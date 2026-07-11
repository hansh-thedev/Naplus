// takes async functions as paramter and we async function returns promisse.
// NOTE we are returning function so that express will call it when some one hits the route
// Here handler = function(req, res, next){do something} that will be called by express.
const catchAsync = function (func) {
  return function (req, res, next) {
    func(req, res, next).catch((err) => next(err));
  };
};

module.exports = catchAsync;
