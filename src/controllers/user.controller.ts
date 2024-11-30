import { Request, Response } from 'express' 
import { IExpressRequest, IUsernameChangeRequest, IPasswordChangeBody  } from "../interfaces";
import { changeUsername, updatePassword, updatePin, getUserDetails } from '../services'; 

export const HandleChangeUsername = async (req: any, res: Response) => {
   try{
      const userId = req.user.id
      const { username, pin } = <IUsernameChangeRequest>req.body

      const response = await changeUsername({username, pin}, userId)
      
      return res.status(200).json(response);
      
   }catch(err: any){
      return res.json(err.message)
   }    
}

export const HandleUpdatePassword = async (req: any, res: Response) => {
   try{
      const userId = req.user.id
      const { oldPassword, newPassword, pin } = <IPasswordChangeBody>req.body

      const response = await updatePassword({ oldPassword, newPassword, pin }, userId)
      
      return res.status(200).json(response);
      
   }catch(err: any){
      return res.json(err.message)
   }    
}

export const HandleUpdatePin = async (req: any, res: Response) => {
   try{
      const userId = req.user.id
      const { oldPin, newPin } = req.body

      const response = await updatePin({oldPin, newPin}, userId)
      
      return res.status(200).json(response);
      
   }catch(err: any){
      return res.json(err.message)
   }    
}

export const HandleGetUserDetails = async (req: any, res: Response) => {
   try{
      const userId = req.user.id

      const response = await getUserDetails(userId)
      
      return res.status(200).json(response);
      
   }catch(err: any){
      return res.json(err.message)
   }    
}