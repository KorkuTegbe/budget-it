import { Document } from "mongoose";

export type TransactionStatus = "pending" | "completed"
export interface ISavings extends Document {
    _id: string;
    amount: number;
    user: string;
}

export interface ITransactions extends Document {
    _id: string
    description: string
    status?: TransactionStatus
    user: string
}