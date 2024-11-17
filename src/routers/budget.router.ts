import { Router } from "express";
import { RequireAuth } from "../middleware";
import { HandleCreateBudget } from "../controllers";

export const BudgetRouter = Router();

BudgetRouter.post('/budgets', RequireAuth, HandleCreateBudget)