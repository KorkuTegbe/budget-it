import { Router } from "express";
import { HandleSignUp, HandleLogin, } from "../controllers";
import { userSignUpValidation, userLoginValidation } from '../validators/validators';

export const AuthRouter = Router()

AuthRouter.post('/auth/signup',  HandleSignUp)
AuthRouter.post('/auth/login',  HandleLogin)
