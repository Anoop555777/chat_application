const AppError = require('./../utils/appError');

function handleCastError(err) {
  const message = `Invalid Id ${err.path}  ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateError = (err) => {
  const value = err.keyValue.email;

  return new AppError(
    `Duplicate field value ${value} please use another value`,
    400
  );
};

function handleValidationErrorDB(err) {
  const error = Object.values(err.errors).map((val) => val.message);
  return new AppError(`invalid inputFields ${error.join('. ')}`, 401);
}

const handleJWTError = () =>
  new AppError(`Invalid token please log in again`, 401);

const handleTokenExpired = () =>
  new AppError('you token have been exprired', 401);

const handleTokenExpiredError = () =>
  new AppError('Token Expired please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log(err.stack);

  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(err);

  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleTokenExpired();

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
