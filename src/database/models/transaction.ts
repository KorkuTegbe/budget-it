import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ITransactions } from '../../interfaces';
import { config } from '../../constants';


const TransactionSchema = new Schema<ITransactions>({
   _id: {
      type: String,
      default: function genUUID() {
         return uuidv4()
      }
   },
   
   description: { 
      type: String 
   },

   status: {
      type: String
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


export const TransactionDb = mongoose.model<ITransactions>(config.mongodb.collections.transactions, TransactionSchema)