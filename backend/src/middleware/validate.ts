import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './error';

// Validation middleware
export const validate = (validations: ValidationChain | ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationArray = Array.isArray(validations) ? validations : [validations];
    
    // Run all validations
    await Promise.all(validationArray.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => err.msg);
    throw new AppError(extractedErrors.join('. '), 400);
  };
};

// Common validation rules
export const commonValidations = {
  id: (field: string = 'id') => ({
    in: ['params'],
    errorMessage: `Invalid ${field}`,
    isMongoId: true,
  }),
  
  requiredString: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} is required`,
    isString: true,
    trim: true,
    notEmpty: true,
  }),

  optionalString: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be a string`,
    isString: true,
    trim: true,
    optional: true,
  }),

  requiredNumber: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be a number`,
    isFloat: true,
    toFloat: true,
  }),

  optionalNumber: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be a number`,
    isFloat: true,
    toFloat: true,
    optional: true,
  }),

  requiredDate: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be a valid date`,
    isISO8601: true,
    toDate: true,
  }),

  optionalDate: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be a valid date`,
    isISO8601: true,
    toDate: true,
    optional: true,
  }),

  requiredEnum: (field: string, values: string[]) => ({
    in: ['body'],
    errorMessage: `${field} must be one of: ${values.join(', ')}`,
    isIn: values,
  }),

  optionalEnum: (field: string, values: string[]) => ({
    in: ['body'],
    errorMessage: `${field} must be one of: ${values.join(', ')}`,
    isIn: values,
    optional: true,
  }),

  requiredArray: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be an array`,
    isArray: true,
  }),

  optionalArray: (field: string) => ({
    in: ['body'],
    errorMessage: `${field} must be an array`,
    isArray: true,
    optional: true,
  }),

  pagination: {
    page: {
      in: ['query'],
      errorMessage: 'Page must be a positive number',
      isInt: { min: 1 },
      toInt: true,
      optional: true,
    },
    limit: {
      in: ['query'],
      errorMessage: 'Limit must be a positive number',
      isInt: { min: 1, max: 100 },
      toInt: true,
      optional: true,
    },
  },
}; 