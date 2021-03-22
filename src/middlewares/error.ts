import { Request, Response, NextFunction } from 'express';

import HttpError from '../errors/http';
import InternalServerError from '../errors/internalServer';

export default async function errorMiddleware(
  err: Error | HttpError | HttpError[],
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  let errors: HttpError[];

  if (process.env.NODE_ENV !== 'test') {
    console.error('REQUESTED_ENDPOINT', req.originalUrl, '\n', 'ERROR_HANDLED', err);
  }

  if (err instanceof Array) errors = err;
  else if (err instanceof HttpError) {
    errors = [err];
  } else {
    console.error('Error without handler', err);
    errors = [new InternalServerError()];

    const error = errors[0];

    res.status(error.status).json({
      error: {
        errors,
        code: error.status,
        messages: error.message,
      },
    });
  }
}
