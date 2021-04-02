import { Request, Response, NextFunction } from 'express';

const async = (fn: (req, res, next) => Promise<void>) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default async;
