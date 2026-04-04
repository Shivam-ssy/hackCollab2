import { logger } from "../loggers/logger.js";
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // console.log("this is from global handler", res.statusCode);
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
