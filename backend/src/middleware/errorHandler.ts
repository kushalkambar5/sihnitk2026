import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('API Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.errorCode,
        ...(err.details && { details: err.details }),
      },
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};
