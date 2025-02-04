import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(val => val.message);
    error = new AppError(`Invalid input data. ${messages.join('. ')}`, 400);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const value = (err as any).errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error = new AppError(`Duplicate field value: ${value}. Please use another value`, 400);
  }

  // Mongoose cast error
  if (err instanceof mongoose.Error.CastError) {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again', 401);
  }

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode || 500).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: err.stack
    });
  } 
  // Production error response
  else {
    // Operational, trusted error: send message to client
    if (error.isOperational) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message
      });
    } 
    // Programming or other unknown error: don't leak error details
    else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}; 