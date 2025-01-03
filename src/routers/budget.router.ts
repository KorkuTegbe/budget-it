import { Router } from "express";
import { RequireAuth } from "../middleware";
import { HandleCreateBudget, HandleGetBudget, HandleGetBudgets, HandleTransferToUsername } from "../controllers";

export const BudgetRouter = Router();

BudgetRouter.post('/budgets', RequireAuth, HandleCreateBudget)
BudgetRouter.get('/budgets', RequireAuth, HandleGetBudgets)
BudgetRouter.get('/budgets/:id', RequireAuth, HandleGetBudget)
BudgetRouter.post('/budgets/:id/transfer', RequireAuth, HandleTransferToUsername)