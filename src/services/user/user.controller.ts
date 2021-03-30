import { Response, Request, NextFunction } from 'express';
import asyncHandler from '../../middlewares/async';

class UserControllerClass {
  public me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: req.user });
  });
}

const UserController = new UserControllerClass();

export default UserController;
