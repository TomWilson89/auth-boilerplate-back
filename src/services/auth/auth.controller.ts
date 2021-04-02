import { Request, Response, NextFunction } from 'express';
import jwt = require('jsonwebtoken');
import crypto = require('crypto');
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

import asyncHandler from '../../middlewares/async';
import User from '../user/user.model';
import { IUserDocument, IUSer } from '../user/user.interface';
import HttpError from '../../errors/http';
import config from '../../config';
import Mailer from '../../utils/mail';
import { buildParams } from '../../utils/controllers';
import InternalServerError from '../../errors/internalServer';

class AuthControllerClass {
  private validParams: (keyof IUSer)[] = ['email', 'name', 'password'];

  private client = new OAuth2Client(config.google.CLIENT_ID);

  private sendToken = (user: IUserDocument, status: number, res: Response) => {
    const token = user.getToken();

    res.status(status).json({ data: token });
  };

  public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) return next(new HttpError('UserAlreadyExists', 422));

    const token = jwt.sign({ email, name, password }, config.jwt.activation.SECRET, {
      expiresIn: config.jwt.activation.EXPIRES,
    });

    try {
      await Mailer.activation(
        email,
        {
          subject: 'Activate your Account',
          link: `${config.client.URL}/activate/${token}`,
        },
        res,
      );
    } catch (err) {
      console.error('Error ocurred while sending mail: ', err);
    }
  });

  public accountActivation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = req.body;

      if (token) {
        const decoded = jwt.verify(token, config.jwt.activation.SECRET);

        const { name, email, password } = decoded as IUSer;

        const body = { name, email, password };

        const user = new User(buildParams<IUSer>(this.validParams, body));

        await user.save();

        this.sendToken(user, 201, res);
      } else {
        next(new InternalServerError());
      }
    },
  );

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new HttpError('InvalidCredentials', 401));
    }

    if (!(await user.matchPassword(password))) {
      return next(new HttpError('InvalidCredentials', 401));
    }

    this.sendToken(user, 200, res);
  };

  public googleLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;

    try {
      const response = await this.client.verifyIdToken({
        idToken,
        audience: config.google.CLIENT_ID,
      });

      const { email, email_verified, name } = response.getPayload();

      if (email_verified) {
        const user = await User.findOne({ email });

        if (user) {
          return this.sendToken(user, 200, res);
        } else {
          let password = await crypto.randomBytes(48).toString('hex');

          const newUser = new User(
            buildParams<IUSer>(this.validParams, { email, name, password }),
          );

          await newUser.save();

          return this.sendToken(newUser, 201, res);
        }
      } else {
        return next(new InternalServerError());
      }
    } catch (error) {
      console.error('error', error);
      return next(new InternalServerError());
    }
  });

  public facebookLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    try {
      const {
        data: { name, email },
      } = await axios.get(url);

      const user = await User.findOne({ email });

      if (user) {
        return this.sendToken(user, 200, res);
      } else {
        let password = await crypto.randomBytes(48).toString('hex');

        const newUser = new User(
          buildParams<IUSer>(this.validParams, { email, name, password }),
        );

        await newUser.save();

        return this.sendToken(newUser, 201, res);
      }
    } catch (error) {
      console.error('error', error);
      return next(new InternalServerError());
    }
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new HttpError('UserDoNotExists', 422));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false, validateModifiedOnly: true });

    const resetUrl = `${config.client.URL}/reset/${resetToken}`;

    try {
      await Mailer.forgotPassword(email, { link: resetUrl, subject: 'Forgot password' }, res);
    } catch (error) {
      console.error('Error ocurred while sending mail: ', error);
    }
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    const resetPasswordToken = crypto
      .createHash(config.crypto.ALGORITHM)
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: new Date(Date.now()) },
    });

    if (!user) {
      return next(new HttpError('InvalidToken', 422));
    }

    user.password = req.body.password;

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    this.sendToken(user, 200, res);
  });
}

export const AuthController = new AuthControllerClass();

export default AuthController;
