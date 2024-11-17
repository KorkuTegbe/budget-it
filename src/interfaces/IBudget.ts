import { Document } from 'mongoose'

export enum BudgetType {
    "day" = 'DAY',
    "weekly" = 'WEEKLY',
    "monthly" = 'MONTHLY',
    "celebration" = "CELEBRATION"
}

export interface IBudget extends Document {
    _id: string;
    name: string;
    description: string;
    duration: number;
    amount: number,
    type: BudgetType;
    user: string;
    createdAt: Date;
    updatedAt: Date;
}
