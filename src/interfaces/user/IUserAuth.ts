import { Document } from 'mongoose';

export interface IUserAuthToken extends Document {
   _id: string;
   email: string;
   token: string;
   user: string;
}

export interface IUsernameChangeRequest {
   username: string;
   pin: string
}

export interface IPasswordChangeBody {
   oldPassword: string,
   newPassword: string,
   pin: string
}

export interface IChangePin {
   oldPin: string
   newPin: string
}