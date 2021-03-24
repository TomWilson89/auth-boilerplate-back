import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

import HttpError from '../errors/http';
import InternalServerError from '../errors/internalServer';
import { Utils } from '../utils';

const error = (
  err: Error | HttpError | HttpError[] | MongoError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let errors: HttpError[];

  if (process.env.NODE_ENV !== 'test') {
    console.error('REQUESTED_ENDPOINT', req.originalUrl, '\n', 'ERROR_HANDLED', err);
  }

  if (err instanceof Array) {
    errors = err;
  } else if (err instanceof HttpError) {
    errors = [err];
  } else if (err instanceof MongoError) {
    if (err.code === 11000) {
      const field = Utils.capitalizeEach(
        err.message.split('index:')[1].split('dup key')[0].split('_')[0],
      );
      errors = [new HttpError('DuplicatedField', 422, { field })];
    } else {
      errors = [new InternalServerError()];
    }
  } else if (err instanceof TokenExpiredError) {
    errors = [new HttpError('TokenExpired', 422)];
  } else if (err instanceof JsonWebTokenError) {
    errors = [new HttpError('InvalidToken', 422)];
  } else {
    console.error('Error without handler', err);
    errors = [new InternalServerError()];
  }

  const error = errors[0];

  res.status(error.status).json({
    error: {
      errors,
      code: error.status,
      messages: error.message,
    },
  });
};

export default error;
