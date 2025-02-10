import { Document } from 'mongoose'

export interface ISpending extends Document {
   _id: string;
  category: Category;
  description: string;
  amount: number;
  sourceBudget: string;
  user: string;
}

export enum Category {
  food = "FOOD",
  clothing = "CLOTHING",
  transport = "TRANSPORTATION",
  emergency = "EMERGENCY",
  bills = "BILLS",
  topup = "TOPUP",
  other = "OTHER"
}