import { userDb, SavingsDb, BudgetDb  } from "../database";
import { BadRequestError, InternalServiceError, NotFoundError, } from "../exceptions";
import { IService, IBudget, ISavings, BudgetType } from "../interfaces";
import { APIFeatures } from "../helpers";


export const createBudget = async (name: string, description: string, amount: string, type: BudgetType, userId: string): Promise<IService> => {
   try {
      const parsedAmount = parseInt(amount);
      
      const budget = await BudgetDb.create({
         name, description, amount: parsedAmount, type: type.toUpperCase(), user: userId
      })

      return {
         status: 200,
         success: true,
         message: 'Budget creation successful',
         data: budget
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



