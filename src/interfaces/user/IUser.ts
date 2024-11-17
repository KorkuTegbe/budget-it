import { Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    name: string;
    username?: string;
    email: string;
    password: string;
    posts?: string;
    avatar: string;
    isValidPassword(password: string): Promise<Boolean>;
}
