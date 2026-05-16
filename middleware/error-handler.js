import { StatusCodes } from 'http-status-codes';
import CustomAPIError from '../errors/custom-api.js';

export const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  // ? HANDLE CUSTOM ERRORS
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({
      msg: err.message,
    });
  }

  // ? JWT ERRORS
  if (err.name === 'JsonWebTokenError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.msg = 'Invalid Token';
  }

  if (err.name === 'TokenExpiredError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.msg = 'Token Expired';
  }

  // ? MONGOOSE VALIDATION ERROR
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;

    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  // ? INVALID OBJECT ID
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;

    customError.msg = `No item found with id : ${err.value}`;
  }

  // ? DUPLICATE KEY ERROR
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;

    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue,
    )} field, please choose another value`;
  }

  return res.status(customError.statusCode).json({
    msg: customError.msg,
  });
};
