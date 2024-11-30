import { Router } from "express";
import { HandleChangeUsername, HandleUpdatePassword, HandleUpdatePin, HandleGetUserDetails} from "../controllers"; 
import { RequireAuth } from "../middleware";


export const UserRouter = Router()

UserRouter.patch('/user/username', RequireAuth,  HandleChangeUsername)
UserRouter.patch('/user/password', RequireAuth, HandleUpdatePassword)
UserRouter.patch('/user/pin', RequireAuth,  HandleUpdatePin)
UserRouter.get('/user', RequireAuth, HandleGetUserDetails)