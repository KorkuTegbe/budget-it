import * as bcrypt from 'bcrypt';
import { BadRequestError, ForbiddenError, UnAuthorizedError, InternalServiceError } from "../exceptions";
import { SavingsDb, userDb, } from "../database";
import { IService, IUser, LoginRequest, SignupLinkRequest } from "../interfaces";
import { JwtHelperClass, JwtType } from "../helpers/jwt.helper";

export const signUpUser =async (body: SignupLinkRequest): Promise<IService> => {
    try{
        const { name, email, password } = body;

        const existingUser = await userDb.findOne({email})

        if (existingUser) {
            throw new BadRequestError('Email is already in use')
        }

        const user = await userDb.create({
            name, email, password
        })

        const token = JwtHelperClass.generateToken({
            userId: user._id, email, type: JwtType.NEW_USER
        })

        const savingsAccount = await SavingsDb.create({
            amount: 2000,
            user
        })

        return {
            status: 201,
            success: true,
            message: 'Signup successful',
            data: { token }
        }
    }catch(error: any){
        return {
            status: error.statusCode,
            success: false,
            message: error.message
        };
    } 
}

export const loginUser = async (body: LoginRequest): Promise<IService | any > => {
    try{
        const { email, password } = body
        if(!(email && password)){
            throw new BadRequestError('Fields cannot be empty')
        }
        const user: IUser | any = await userDb.findOne({ email }); 
        
        if (!user) {
            throw new BadRequestError('User not found!')
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(passwordMatch) {
            const token = JwtHelperClass.generateToken({
                userId: user._id, email, type: JwtType.USER
            })
            
            return {
                status: 200,
                success: true,
                message: 'Login successful',
                data: {token}
            }
        }
                 
    }catch(error: any) {
        return {
            status: error.statusCode,
            success: false,
            message: error.message
        };
    }

    // TODO
    // social login ie google login
}
