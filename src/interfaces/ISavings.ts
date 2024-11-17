import { Document } from "mongoose";

export interface ISavings extends Document {
    _id: string;
    amount: number;
    user: string;
}