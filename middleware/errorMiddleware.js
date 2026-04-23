const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Resource not found";
    statusCode = 404;
  }

  // Duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };