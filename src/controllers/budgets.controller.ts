import { Request, Response } from "express";
import { createBudget, getABudget, getBudgets, transferToUsername} from "../services"; //


export const HandleCreateBudget = async (req: any, res: Response) => {
   try {
      const userId = req.user.id
      const { amount, category, frequency, pin } = req.body;
      
      const response = await createBudget(amount, category, frequency, pin, userId)
      
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}

export const HandleGetBudget = async (req: any, res: Response) => {
   try {
      const userId = req.user.id
      const { id } = req.params;
      
      const response = await getABudget(userId, id)
      
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}

export const HandleGetBudgets = async (req: any, res: Response) => {
   try {
      const userId = req.user.id
      const { search, sortBy, sortOrder, page, limit } = req.query as {
         search: string, sortBy: string, sortOrder: 'ASC' | 'DESC', page: number, limit: number
      }

      const response = await getBudgets(userId, {search, sortBy, sortOrder, page, limit})
      
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}

export const HandleTransferToUsername = async (req: any, res: Response) => {
   try {
      const userId = req.user.id;
      const budgetId = req.params.id  
      const { amount, username } = req.body;

      const response = await transferToUsername(budgetId, amount, username);
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}