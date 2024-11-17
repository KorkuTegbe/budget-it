import { Request, Response } from 'express' 
import { SignupLinkRequest, LoginRequest,  } from "../interfaces";
import { loginUser, signUpUser } from '../services';
import { BadRequestError } from '../exceptions';

export const HandleSignUp = async (req: Request, res: Response) => {
    try{
        const { name, email, password } = <SignupLinkRequest>req.body

        const response = await signUpUser({ name, email, password, })
        
        return res.status(200).json(response);
        
    }catch(err: any){
        return res.json(err.message)
    }    
}

export const HandleLogin = async (req: Request, res: Response) => {
    try{
        const { email, password } = <LoginRequest>req.body

        const response = await loginUser({ email, password })
        
        return res.status(200).json(response);
        
    }catch(err: any){
        return res.json(err.message)
    }    
}
