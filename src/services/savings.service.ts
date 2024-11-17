import { userDb, BudgetDb, SavingsDb  } from "../database";
import { BadRequestError, NotFoundError, } from "../exceptions";
import { IService, IBudget, ISearchQuery, ISavings } from "../interfaces";
import { APIFeatures } from "../helpers";


export const checkSavingsBalance = async (id: string): Promise<IService> => {
   try{
      const user = id

      const balance = await SavingsDb.find({
         user,
      }).select("amount")

      return {
         status: 200,
         success: true,
         message: 'Savings balance fetched successfully',
         data: balance,
      }
   }catch(error: any){
      return {
         status: 500,
         success: false,
         message: error.message
      };
   } 
}

export const topUpBalance = async (userId: string, savingsId: string, amount: number): Promise<IService> => {
   try{
      const savings = await SavingsDb.findOne({
         _id: savingsId,
         user: userId
      })

      if (!savings) {
         throw new NotFoundError(`Savings account with id ${savingsId} does not exist`)
      }

      savings.amount += amount ;

      savings.save();

      return {
         status: 200,
         success: true,
         message: 'Savings balance topup successful'
      }
   }catch(error: any){
      console.log(error)
      return {
         status: 500,
         success: false,
         message: error.message
      };
   } 
}

export const transfer = async (): Promise<IService> => {
   try {

      return {
         status: 200,
         success: true,
         message: 'Savings balance topup successful'
      }
   } catch (error: any) {
      console.log(error)
      return {
         status: 500,
         success: false,
         message: error.message
      };
   }
}