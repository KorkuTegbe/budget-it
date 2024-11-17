import { Document } from 'mongoose'

export interface ISpending extends Document {
   _id: string;
  category: Category;
  budget: string;
  user: string;
}

export enum Category {
  "Food" = "Food",
  "Clothing" = "Clothing",
  "Transport" = "Transportation",
  "Emergency" = "Emergency"
}