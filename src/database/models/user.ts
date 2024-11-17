import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt'
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../interfaces';
import { config } from '../../constants';

const UserSchema = new Schema<IUser>({
    _id: {
        type: String,
        default: function genUUID() {
            return uuidv4()
        }
    }, 
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Password is required'],
        lowercase: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
    },
},{
    toObject: {
       virtuals: true,
       transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.password;
          return ret;
       }
    },
    toJSON: {
       virtuals: true,
       transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.password;
          return ret;
       }
    },
    timestamps: true,
    versionKey: false
})

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

UserSchema.methods.isValidPassword = async function (password: string) {
    try {
        const user = this;
        const match = await bcrypt.compare(password, user.password);
        return match;
    } catch (error: any) {
        // Handle errors appropriately
        throw new Error(error.message);
    }
}


export const userDb = mongoose.model<IUser>(config.mongodb.collections.users, UserSchema)