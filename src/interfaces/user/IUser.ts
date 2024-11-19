import { Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    firstName: string;
    lastName: string
    username?: string;
    email: string;
    password: string;
    phoneNumber: string;
    pin: number;
    accountNumber: string;
    isValidPassword(password: string): Promise<Boolean>;
}
