import { Router } from "express";
import { RequireAuth } from "../middleware";
import {HandleCheckSavingsBalance, HandleTopUpBalance } from "../controllers";


export const SavingsRouter = Router();

SavingsRouter.get('/savings', RequireAuth, HandleCheckSavingsBalance)
SavingsRouter.post('/savings/:id', RequireAuth, HandleTopUpBalance)
