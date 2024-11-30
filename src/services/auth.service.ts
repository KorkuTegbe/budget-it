import * as bcrypt from 'bcrypt';
import { BadRequestError, DuplicateError, ForbiddenError, UnAuthorizedError, InternalServiceError } from "../exceptions";
import { SavingsDb, userDb, } from "../database";
import { IService, IUser, LoginRequest, SignupLinkRequest } from "../interfaces";
import { JwtHelperClass, JwtType, } from "../helpers/jwt.helper";
import { generateAccountNumber, generateUsername } from '../helpers';

export const signUpUser =async (body: SignupLinkRequest): Promise<IService> => {
    try{
        const { firstName, lastName, email, phoneNumber, pin, password } = body;

        const existingUser = await userDb.findOne({email})

        if (existingUser) {
            throw new DuplicateError('Email is already in use')
        }

        const accountNumber = await generateAccountNumber(phoneNumber)
        const username = await generateUsername(firstName, lastName)

        const user = await userDb.create({
            firstName, lastName, email, password, pin, phoneNumber, accountNumber, username
        })

        const token = JwtHelperClass.generateToken({
            userId: user._id, email, type: JwtType.USER
        })

        await SavingsDb.create({
            amount: 0,
            user
        })

        return {
            status: 201,
            success: true,
            message: 'Signup successful',
            data: { user: { accountNumber: user.accountNumber, username: user.username}, token }
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
        const { accountNumber, password } = body
        if(!(accountNumber && password)){
            throw new BadRequestError('Fields cannot be empty')
        }
        const user: IUser | any = await userDb.findOne({ accountNumber }); 
        
        if (!user) {
            throw new BadRequestError('User not found!')
        }

        const email = user.email;

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(passwordMatch) {
            const token = JwtHelperClass.generateToken({
                userId: user._id, email, type: JwtType.USER
            })
            
            return {
                status: 200,
                success: true,
                message: 'Login successful',
                data: { 
                    user: { 
                        accountNumber: user.accountNumber, 
                        username: user.username
                    }, 
                    token
                }
            }
        } else {
            return {
                status: 200,
                success: true,
                message: 'Incorrect Login Credentials',
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
