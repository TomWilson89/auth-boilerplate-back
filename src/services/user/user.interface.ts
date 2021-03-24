import { Document } from 'mongoose';
import { Role, IRole } from '../roles/roles.interface';

export interface IUSer {
  name: string;
  email: string;
  password: string;
  role: Role | IRole;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  deletedAt: Date | undefined;
}

export interface IUserDocument extends IUSer, Document {
  createdAt: Date;
  matchPassword(password: string): Promise<boolean>;
  getResetPasswordToken(): string;
  getToken(): string;
}
