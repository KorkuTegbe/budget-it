import { Request, Response } from 'express' 
import { SignupLinkRequest, LoginRequest,  } from "../interfaces";
import { loginUser, signUpUser } from '../services';

export const HandleSignUp = async (req: Request, res: Response) => {
    try{
        const { firstName, lastName, phoneNumber, pin, email, password } = <SignupLinkRequest>req.body

        const response = await signUpUser({ firstName, lastName, phoneNumber, email, pin, password })
        
        return res.status(200).json(response);
        
    }catch(err: any){
        return res.json(err.message)
    }    
}

export const HandleLogin = async (req: Request, res: Response) => {
    try{
        const { accountNumber, password } = <LoginRequest>req.body

        const response = await loginUser({ accountNumber, password })
        
        return res.status(200).json(response);
        
    }catch(err: any){
        return res.json(err.message)
    }    
}
