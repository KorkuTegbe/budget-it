import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ISavings } from '../../interfaces';
import { config } from '../../constants';


const SavingsSchema = new Schema<ISavings>({
    _id: {
        type: String,
        default: function genUUID() {
            return uuidv4()
        }
    },
    
    amount: { type: Number },

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


export const SavingsDb = mongoose.model<ISavings>(config.mongodb.collections.savings, SavingsSchema)