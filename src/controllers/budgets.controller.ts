import { Request, Response } from "express";
import { createBudget } from "../services";


export const HandleCreateBudget = async (req: any, res: Response) => {
   try {
      const userId = req.user.id
      const { name, description, amount, type } = req.body;
      
      const response = await createBudget(name, description, amount, type, userId)
      
      return res.status(200).json(response)
   } catch (error: any) {
      return res.json(error.message)
   }
}