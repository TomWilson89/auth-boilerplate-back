import { Request, Response, NextFunction } from 'express';
import jwt = require('jsonwebtoken');

import asyncHandler from './async';
import HttpError from '../errors/http';
import config from '../config';
import User from '../services/user/user.model';
import { IUserDocument } from '../services/user/user.interface';

export const authorize = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new HttpError('NotAuthorized', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.SECRET);
    console.log(`decoded`, decoded);

    const user = await User.findById((decoded as IUserDocument).id);

    req.user = user;
  } catch (error) {
    console.log(`error`, error);
    return next(new HttpError('InvalidToken', 401));
  }

  next();
});
