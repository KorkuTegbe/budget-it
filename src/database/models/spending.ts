import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../constants';
import { ISpending, Category } from '../../interfaces'

const SpendingsSchema = new Schema<ISpending>({
   _id: {
      type: String,
      default: function genUUID() {
         return uuidv4()
      }
   },
   
   category: { 
      type: String,
      enum: Object.values(Category)
   },

   description: {
      type: String,
      required: true
   },

   amount: {
      type: Number,
      required: true
   },

   sourceBudget: {
      type: String, 
      ref: config.mongodb.collections.budgets,
      required: true
   },

   user: {
      type: String, 
      ref: config.mongodb.collections.users,
      required: true
   },
},{
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


export const SpendingDb = mongoose.model<ISpending>(config.mongodb.collections.spendings, SpendingsSchema)