import * as bcrypt from 'bcrypt';
import { BadRequestError, DuplicateError, ForbiddenError, UnAuthorizedError, InternalServiceError } from "../exceptions";
import { SavingsDb, userDb, } from "../database";
import { IService, IUser, IPasswordChangeBody, IUsernameChangeRequest, IChangePin} from "../interfaces";

export const changeUsername =async (body: IUsernameChangeRequest, userId: any): Promise<IService> => {
    try{
      const { username, pin } = body;

      const parsedPin = Number(pin)
      
      const user = await userDb.findOne({_id: userId})

      if (parsedPin === user?.pin) {
         await userDb.findByIdAndUpdate(
            { _id: userId },
            {
               username
            }, 
            { new: true }
         );
      } else {
         return {
            status: 400,
            success: false,
            message: 'Invalid Pin'
         }
      }

      return {
         status: 200,
         success: true,
         message: 'Username change successful'
      }
    }catch(error: any){
        return {
            status: error.statusCode,
            success: false,
            message: error.message
        };
    } 
}

export const updatePassword = async (body: IPasswordChangeBody, userId: any): Promise<IService | any > => {
    try{
      const { oldPassword, newPassword, pin } = body
      const parsedPin = Number(pin);
      if(!oldPassword || !newPassword){
         throw new BadRequestError('Fields cannot be empty')
      }

      const user: IUser | any = await userDb.findOne({ _id: userId }); 
      
      if (!user) {
         throw new BadRequestError('User not found!')
      }

      // validate old password
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if(!passwordMatch) {
         return {
            status: 400,
            success: false,
            message: 'Incorrect Password',
         }
      }

      if(parsedPin === user.pin) {
         user.password = newPassword
         user.save()
      } else {
         return {
            status: 200,
            success: true,
            message: 'Incorrect Pin',
         }
      }
         
      return {
         status: 200,
         success: true,
         message: 'Password changed successfully'
      }
                 
    }catch(error: any) {
        return {
            status: error.statusCode,
            success: false,
            message: error.message
        };
    }
}

export const updatePin = async (body: IChangePin, userId: any): Promise<IService | any > => {
   try{
      const { oldPin, newPin } = body
      const parsedOldPin = Number(oldPin);
      const parsedNewPin = Number(newPin);
      if(!oldPin || !newPin){
         throw new BadRequestError('Fields cannot be empty')
      }

      const user: IUser | any = await userDb.findOne({ _id: userId }); 
      
      if (!user) {
         throw new BadRequestError('User not found!')
      }

      // validate old password
      if (user.pin !== parsedOldPin){
         throw new BadRequestError("Incorrect Pin")
      };

      user.pin = parsedNewPin
      user.save()
         
      return {
         status: 200,
         success: true,
         message: 'Pin changed successfully'
      }        
   }catch(error: any) {
      return {
         status: error.statusCode,
         success: false,
         message: error.message
      };
   }
}

export const getUserDetails = async (userId: any): Promise<IService> => {
   try {
      const user = await userDb.findOne({ _id: userId }).select('firstName lastName email username accountNumber phoneNumber');
      
      if (!user) {
         throw new BadRequestError('User not found!')
      }

      return {
         status: 200,
         success: true,
         message: 'User details fetched successfully',
         data: { user }
      } 
   } catch (error: any) {
      console.log(error)
      return {
         status: error.statusCode,
         success: false,
         message: "Something went wrong"
      };
   }
}