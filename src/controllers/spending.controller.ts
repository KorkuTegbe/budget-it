import { Request, Response } from "express";
import { makeSpending, getSpendingAnalytics, getSpendingTransactions, getTransactionById, SpendingAnalyticsQuery } from "../services";



export const HandleMakeSpending = async (req: Request, res: Response) => {
   try{
      // @ts-ignore 
      const { id } = req.user;
      const { amount, category, description, budgetId, pin } = req.body

      const response = await makeSpending(id, amount, category, description, budgetId, pin)

      return res.status(200).json(response);
       
   }catch(err: any){
      return res.json(err.message)
   }    
}

export const HandleGetTransactions = async (req: any, res: Response) => {
   try {
      const userId = req.user.id
      const { search, sortBy, sortOrder, page, limit } = req.query as {
         search: string, sortBy: string, sortOrder: 'ASC' | 'DESC', page: number, limit: number
      }

      const response = await getSpendingTransactions(userId, {search, sortBy, sortOrder, page, limit})
      
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}

export const HandleGetTransactionById = async (req: any, res: Response) => {
   try {
      const userId = req.user.id
      const { id } = req.params;
      
      const response = await getTransactionById(userId, id)
      
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}

export const HandleSpendingAnalytics = async (req: Request, res: Response) => {
   try{
      // @ts-ignore 
      const userId = req.user.id;
      const { from, to, category, groupBy }: SpendingAnalyticsQuery = req.query

      const response = await getSpendingAnalytics(userId, {from, to, category, groupBy})

      return res.status(200).json(response);
       
   }catch(err: any){
      console.log(err.stack)
      return res.json(err.message)
   }    
}