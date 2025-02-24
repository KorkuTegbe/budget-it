import { BudgetDb, SpendingDb, userDb, TransactionDb  } from "../database";
import { BadRequestError, NotFoundError, } from "../exceptions";
import { IService } from "../interfaces";
import { APIFeatures } from "../helpers";


export const makeSpending = async (userId: string, amount: number, category: string, description: string, budgetId: string, pin: string): Promise<IService> => {
   try{
      const parsedPin = parseInt(pin)
      const user = await userDb.findById(userId).select('pin')

      const sourceBudget = await BudgetDb.findOne({
         _id: budgetId, user: userId
      })

      if (!sourceBudget) {
         throw new NotFoundError("No budget found")
      }
      
      if (sourceBudget.amount < amount) {
         throw new BadRequestError("Your balance is insufficient")
      } else {
         // deduct 
         sourceBudget.amount -= amount
      }
      
      if (user?.pin === parsedPin) {
         await SpendingDb.create({
            category: category.toUpperCase(),
            description,
            amount, 
            sourceBudget,
            user: userId
         })

         // transaction
         await TransactionDb.create({
            description,
            status: 'completed',
            user: userId
         })
      }else {
         throw new BadRequestError("Incorrect pin")
      }

      await sourceBudget.save();

      return {
         status: 200,
         success: true,
         message: 'Spending operation successful',
      }
   }catch(error: any){
      return {
         status: 500,
         success: false,
         message: error.message
      };
   } 
}

export const getSpendingTransactions = async (userId: string,
   query: {
      search?: string,
      sortBy?: string,
      sortOrder?: 'ASC' | 'DESC',
      page?: number,
      limit?: number,
   }
): Promise<IService> => {
   try{
      const { search, sortBy = 'createdAt', sortOrder = 'ASC', page = 1, limit = 10 } = query;

      const filter: any = { user: userId };

      // Calculate pagination values
      const skip = (page - 1) * limit;

      // Fetch budgets with sorting, pagination, and filter
      // const history = await SpendingDb.find(filter)
      //    .sort({ [sortBy]: sortOrder === 'DESC' ? 1 : -1 })
      //    .skip(skip)
      //    .limit(limit).select('description amount createdAt');
      const history = await TransactionDb.find(filter)
         .sort({ [sortBy]: sortOrder === 'DESC' ? 1 : -1 })
         .skip(skip)
         .limit(limit).select('description status createdAt')

      // Count total documents for pagination metadata
      const total = await TransactionDb.countDocuments(filter);

      return {
         status: 200,
         success: true,
         message: 'Spending history fetch successful',
         data: {
            pagination: {
               total,
               page,
               limit,
               totalPages: Math.ceil(total / limit),
               history,
            }
         }
      }
   }catch(error: any){
      return {
         status: error.statusCode,
         success: false,
         message: error.message
      };
   } 
}

export const getTransactionById = async (userId: string, id: string): Promise<IService> => {
   try {

      const spending = await SpendingDb.findOne({_id: id, user: userId})

      if (!spending) {
         throw new NotFoundError(`Spending with ID: ${id} not found`)
      }

      return {
         status: 200,
         success: true,
         message: 'Budget fetched successfully',
         data: spending
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

export const getSpendingAnalytics = async (): Promise<IService> => {
   try {

      return {
         status: 200,
         success: true,
         message: 'Savings balance topup successful'
      }
   } catch (error: any) {
      return {
         status: error.statusCode,
         success: false,
         message: error.message
      };
   }
}