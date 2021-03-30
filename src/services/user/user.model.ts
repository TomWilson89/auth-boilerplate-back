import crypto = require('crypto');

import argon2 = require('argon2');
import jwt = require('jsonwebtoken');
import { Schema, model } from 'mongoose';
import { NextFunction } from 'express';

import { IUserDocument } from './user.interface';
import config from '../../config';
import Roles from '../roles/roles.model';
import { Role } from '../roles/roles.interface';

const schema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'FieldIsRequired'],
      max: [32, 'FieldIsNotValid'],
      min: [2, 'FieldIsNotValid'],
    },

    email: {
      type: String,
      trim: true,
      required: [true, 'FieldIsRequired'],
      max: [32, 'FieldIsNotValid'],
      min: [2, 'FieldIsNotValid'],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'FieldIsNotValid',
      ],
    },

    password: {
      type: String,
      required: [true, 'FieldIsRequired'],
      max: [20, 'FieldIsTooLong'],
      min: [6, 'FieldIsTooShort'],
      select: false,
    },

    role: {
      type: Number,
      enum: Roles.find(),
      required: [true, 'FieldIsRequired'],
      default: Role.USER,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

schema.index({ email: 1 });

schema.pre<IUserDocument>('save', async function (next: NextFunction) {
  if (this.isNew) {
    this.createdAt = new Date();
  }

  if (this.isModified('password') || this.isNew) {
    this.password = await argon2.hash(this.password, {
      parallelism: Number(config.argon.ARGON_PARALLELISM),
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      hashLength: Number(config.argon.ARGON_LENGTH),
      timeCost: Number(config.argon.ARGON_TIME_COST),
    });
  }

  next();
});

schema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, config.jwt.SECRET, {
    expiresIn: config.jwt.EXPIRES,
  });
};

schema.methods.matchPassword = async function (password) {
  return await argon2.verify(this.password, password);
};

schema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash(config.crypto.ALGORITHM)
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export const User = model<IUserDocument>('User', schema);
export default User;
