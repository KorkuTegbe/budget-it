import { Document } from 'mongoose'

export enum BudgetType {
    // day = 'DAY',
    // weekly = 'WEEKLY',
    monthly = 'MONTHLY',
    // celebration = "CELEBRATION"
}

// export type BudgetType = "DAY" | "WEEKLY" | "MONTHLY" | "CELEBRATION"


export interface IBudget extends Document {
    _id: string;
    name: string;
    description: string;
    duration: number;
    amount: number,
    category: BudgetType;
    user: string;
    createdAt: Date;
    updatedAt: Date;
    frequency: number
    deleteAt: Date
}
