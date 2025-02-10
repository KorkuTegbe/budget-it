import { Router } from "express";
import { HandleMakeSpending, HandleGetTransactions, HandleGetTransactionById } from "../controllers"; 
import { RequireAuth } from "../middleware";


export const SpendingRouter = Router()

SpendingRouter.post('/spending', RequireAuth, HandleMakeSpending);
SpendingRouter.get('/spending', RequireAuth, HandleGetTransactions);
SpendingRouter.get('/spending/:id', RequireAuth, HandleGetTransactionById);
// SpendingRouter.get('/spending/analytics', RequireAuth, )