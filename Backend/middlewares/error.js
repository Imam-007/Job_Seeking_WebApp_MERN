class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "caseError") {
    const message = `Resource not found . Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token invalid. Try Again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpireError") {
    const message = `Json web Token expire.Try Again`;
    err = new ErrorHandler(message, 400);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
