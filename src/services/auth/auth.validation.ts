import { Request, Response, NextFunction } from 'express';
import isEmail from 'validator/lib/isEmail';

import HttpError from '../../errors/http';

class AuthValidationClass {
  public create = (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    const errors: HttpError[] = [];

    if (!body.email) errors.push(new HttpError('FieldIsRequired', 422, { field: 'email' }));

    if (body.email && !isEmail(body.email)) {
      errors.push(new HttpError('FieldIsNotValid', 422, { field: 'email' }));
    }
    if (!body.password) errors.push(new HttpError('FieldIsRequired', 422, { field: 'password' }));

    if (body.password && body.password.length < 6) {
      errors.push(new HttpError('FieldIsTooShort', 422, { field: 'password', limit: '6' }));
    }

    if (body.password && body.password.length > 20) {
      errors.push(new HttpError('FieldIsTooLong', 422, { field: 'password', limit: '20' }));
    }

    if (!body.name) errors.push(new HttpError('FieldIsRequired', 422, { field: 'name' }));

    if (body.name && body.name.length < 2) {
      errors.push(new HttpError('FieldIsTooShort', 422, { field: 'name', limit: '2' }));
    }

    if (body.password && body.password.length > 32) {
      errors.push(new HttpError('FieldIsTooLong', 422, { field: 'name', limit: '32' }));
    }

    if (errors.length) next(errors);
    else next();
  };

  public login = (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    const errors: HttpError[] = [];

    if (!body.email) errors.push(new HttpError('FieldIsRequired', 422, { field: 'email' }));

    if (body.email && !isEmail(body.email)) {
      errors.push(new HttpError('FieldIsNotValid', 422, { field: 'email' }));
    }
    if (!body.password) errors.push(new HttpError('FieldIsRequired', 422, { field: 'password' }));

    if (
      (body.password && body.password.length < 6) ||
      (body.password && body.password.length > 20)
    ) {
      errors.push(new HttpError('FieldIsNotValid', 422, { field: 'password' }));
    }

    if (errors.length) next(errors);
    else next();
  };

  public forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const errors: HttpError[] = [];

    if (!email) errors.push(new HttpError('FieldIsRequired', 422, { field: 'email' }));

    if (email && !isEmail(email)) {
      errors.push(new HttpError('FieldIsNotValid', 422, { field: 'email' }));
    }

    if (errors.length) next(errors);
    else next();
  };

  public resetPassword = (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;

    const errors: HttpError[] = [];

    if (!token) errors.push(new HttpError('FieldIsRequired', 422, { field: 'token' }));

    if (!password) errors.push(new HttpError('FieldIsRequired', 422, { field: 'password' }));

    if (password && password.length < 6) {
      errors.push(new HttpError('FieldIsTooShort', 422, { field: 'password', limit: '6' }));
    }

    if (password && password.length > 20) {
      errors.push(new HttpError('FieldIsTooLong', 422, { field: 'password', limit: '20' }));
    }

    if (errors.length) next(errors);
    else next();
  };
}

export const AuthValidation = new AuthValidationClass();

export default AuthValidation;
