import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IBudget, BudgetType } from '../../interfaces';
import { config } from '../../constants';


const BudgetSchema = new Schema<IBudget>({
    _id: {
        type: String,
        default: function genUUID() {
            return uuidv4()
        }
    },
    name: { 
        type: String, 
        required: true,
    },

    description: {
        type: String
    },

    amount: {
        type: Number
    },

    type: {
        type: String,
        enum: Object.values(BudgetType),
        default: BudgetType.day
    },
    
    user: {
        type: String,
        ref: config.mongodb.collections.users,
        required: true
    }
}, {
    toObject: {
       virtuals: true,
       transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          return ret;
       }
    },
    toJSON: {
       virtuals: true,
       transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          return ret;
       }
    },
    timestamps: true,
    versionKey: false
})

export const BudgetDb = mongoose.model<IBudget>(config.mongodb.collections.budgets, BudgetSchema)