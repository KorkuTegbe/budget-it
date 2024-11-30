import { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';
import { userDb } from '../database';
import { UnAuthorizedError, BadRequestError, ForbiddenError, NotFoundError  } from '../exceptions';
import { JwtHelperClass } from '../helpers/jwt.helper';
import { IUser } from '../interfaces';


export const RequireAuth = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const accessToken = <string>req.headers['x-auth-token'];
        if(!accessToken){
            return next(new ForbiddenError("No Auth Token provided"))
        }
        const verifyToken = await JwtHelperClass.verifyToken(accessToken);
        
        const user = await userDb.findById(verifyToken.userId);

        if(!user){
            return next(new BadRequestError("Invalid Token"));
        }
        req.user = {id: user.id, email: user.email};
        
        return next();
    } catch (error: any) {
        return {
            status: error.statusCode,
            success: false,
            message: error.message
        };
    }
}