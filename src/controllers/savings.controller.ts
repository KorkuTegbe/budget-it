import { Request, Response } from "express";
import { checkSavingsBalance, topUpBalance, } from "../services";



export const HandleCheckSavingsBalance = async (req: Request, res: Response) => {
   try{
      // @ts-ignore 
      const { id } = req.user;

      const response = await checkSavingsBalance(id)

      return res.status(200).json(response);
       
   }catch(err: any){
      return res.json(err.message)
   }    
}

export const HandleTopUpBalance = async (req: Request, res: Response) => {
   try{
      // @ts-ignore 
      const userId = req.user.id;
      const { id } = req.params;
      const { amount } = req.body;

      const response = await topUpBalance(userId, id, amount)

      return res.status(200).json(response);
       
   }catch(err: any){
      return res.json(err.message)
   }    
}
