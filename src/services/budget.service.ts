import { userDb, SavingsDb, BudgetDb  } from "../database";
import { BadRequestError, InternalServiceError, NotFoundError, } from "../exceptions";
import { IService, IBudget, ISavings, BudgetType } from "../interfaces";
import { APIFeatures } from "../helpers";


export const createBudget = async (amount: string, category: BudgetType, frequency: number, pin: string, userId: string): Promise<IService> => {
   try {
      const user = await userDb.findOne({
         _id: userId
      })

      const parsedAmount = parseInt(amount);
      const parsedPin = parseInt(pin)

      let duration;
      if (category=="DAY") {
         duration = 1
      } else if (category == "WEEKLY") {
         duration = 7
      } else if (category == 'MONTHLY') {
         duration = 30
      } else {
         duration = 5
      }

      const budget = new BudgetDb({
         amount: parsedAmount,
         category: category.toUpperCase(),
         duration,
         frequency,
         user: userId
      })
      
      if (parsedPin !== user?.pin) {
         throw new BadRequestError("Invalid Pin")
      }

      await budget.save()
      
      return {
         status: 200,
         success: true,
         message: 'Budget creation successful',
         data: budget.id
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

export const getABudget = async (userId: string, id: string): Promise<IService> => {
   try {
      const budget = await BudgetDb.findOne({_id: id, user: userId})

      if (!budget) {
         throw new NotFoundError(`Budget with ID: ${id} not found`)
      }

      return {
         status: 200,
         success: true,
         message: 'Budget fetched successfully',
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

export const getBudgets = async (userId: string,
   query: {
      search?: string,
      sortBy?: string,
      sortOrder?: 'ASC' | 'DESC',
      page?: number,
      limit?: number,
   }
): Promise<IService> => {
   try {
      const { search, sortBy = 'createdAt', sortOrder = 'DESC', page = 1, limit = 10 } = query;

      const filter: any = { user: userId };

      // Calculate pagination values
      const skip = (page - 1) * limit;

      // Fetch budgets with sorting, pagination, and filter
      const budgets = await BudgetDb.find(filter)
         .sort({ [sortBy]: sortOrder === 'ASC' ? 1 : -1 })
         .skip(skip)
         .limit(limit);

      // Count total documents for pagination metadata
      const total = await BudgetDb.countDocuments(filter);

      return {
         status: 200,
         success: true,
         message: 'Budgets fetched successfully',
         data: {
            pagination: {
               total,
               page,
               limit,
               totalPages: Math.ceil(total / limit),
               budgets,
            }
         }
      };
   } catch (error: any) {
      console.error(error);
      return {
         status: 500,
         success: false,
         message: error.message
      };
   }
};




