import * as jwt from 'jsonwebtoken';
import { config } from '../constants';
import { BadRequestError, ForbiddenError } from '../exceptions';


export enum JwtType {
    NEW_USER = 'NEW USER',
    USER = 'USER'
}

interface GenerateTokenParam {
    email: string;
    userId: string;
    type: JwtType;
    expiresIn?: number
}


class JwtHelper {

    generateToken(body: any): string {
        const encryptionKey = Buffer.from(config.jwtPrivateKey, 'base64').toString();
        if(body.type === JwtType.NEW_USER) {
            return jwt.sign({
                email: body.email,
                type: JwtType.NEW_USER
            }, encryptionKey, { expiresIn: '1W'})
        }

        if(body.type === JwtType.USER) {
            return jwt.sign({
                email: body.email,
                userId: body.userId,
                type: JwtType.USER
            }, encryptionKey, { expiresIn: '1W'})
        }

        throw new BadRequestError('Type not supported yet!')
    }

    async verifyToken(token: string): Promise<GenerateTokenParam>{
        try{
            const result = await jwt.verify(token, Buffer.from(config.jwtPrivateKey, 'base64').toString())
            return result as GenerateTokenParam;
        } catch(error: any) {
            console.error(error);
            throw{
                code: 403,
                data: error
            }
        }
    }
}

export const JwtHelperClass = new JwtHelper()