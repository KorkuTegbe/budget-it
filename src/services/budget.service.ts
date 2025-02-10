import { userDb, SavingsDb, BudgetDb  } from "../database";
import { BadRequestError, InternalServiceError, NotFoundError, } from "../exceptions";
import { IService, IBudget, ISavings, BudgetType } from "../interfaces";
import { APIFeatures } from "../helpers";
import { differenceInDays } from "date-fns";


export const createBudget = async (amount: string, category: BudgetType, frequency: number, pin: string, userId: string): Promise<IService> => {
   try {
      const user = await userDb.findOne({
         _id: userId
      });

      const parsedAmount = parseInt(amount);
      const parsedPin = parseInt(pin)

      const savings = await SavingsDb.findOne({
         user: userId
      });
      // @ts-ignore
      if (savings?.amount <= parsedAmount) {
         throw new BadRequestError("Insufficient funds!")
      }

      // deduct from savings balance
      // @ts-ignore
      savings?.amount -= parsedAmount;

      const { allowed, remainingDays } = await canCreateBudget(userId)
      if (!allowed) {
         throw new BadRequestError(`You already have an active budget. ${remainingDays} days left before you can create a new one.`)
      }
      const budget = new BudgetDb({
         amount: parsedAmount,
         category: category.toUpperCase(),
         frequency,
         user: userId
      })
      
      if (parsedPin !== user?.pin) {
         throw new BadRequestError("Invalid Pin")
      }

      await savings?.save(); //save deduction from savings
      await budget.save()
      
      return {
         status: 200,
         success: true,
         message: 'Budget creation successful',
         data: budget.id
      }
   } catch (error: any) {
      return {
         status: 500,
         success: false,
         message: error.message
      };
   }
}

export const getABudget = async (userId: string, id: string): Promise<IService> => {
   try {
      const now = new Date();

      // Delete the budget if it's expired
      await BudgetDb.deleteMany({ _id: id, deleteAt: { $lte: now } });

      const budget = await BudgetDb.findOne({_id: id, user: userId, deleteAt: { $gt: now }})
      // getRemainingDays(budget?.createdAt, budget?.duration)
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
      const now = new Date()

      // Delete expired budgets before returning active ones
      await BudgetDb.deleteMany({ deleteAt: { $lte: now } });


      const { search, sortBy = 'createdAt', sortOrder = 'DESC', page = 1, limit = 10 } = query;

      const filter: any = { user: userId, deleteAt: { $gt: now } };

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


export const transferToUsername = async (userId: string, budgetId: string, amount: number, pin: string, username: string): Promise<IService> => {
   try {
      const user = await userDb.findById(userId)

      const budget = await BudgetDb.findById(budgetId)

      if (!budget) {
         throw new BadRequestError("Bad Request")
      }

      const recipient = await userDb.findOne({
         username
      });

      if (!recipient) {
         throw new NotFoundError(`User with username ${username} not found.`)
      }

      // check if budget balance is enough
      if (budget.amount <= amount) {
         throw new BadRequestError("Insufficient balance to transfer")
      }

      // check pin
      if (user?.pin !== Number(pin)) {
         throw new BadRequestError("Incorrect Pin")
      }

      // debit sender and credit recipient
      budget.amount -= amount;
      await budget.save()
      // sender's savings
      let userSavings = await SavingsDb.findOne({ user: recipient._id }).select('amount');
      // @ts-ignore
      userSavings?.amount += amount;
      await userSavings?.save()

      return {
         status: 200,
         success: true,
         message: `Transfer of funds to ${username} successful`
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

const canCreateBudget = async (userId: string): Promise<{ allowed: boolean; remainingDays?: number }> => {
   const activeBudget = await BudgetDb.findOne({ 
      user: userId, 
      createdAt: { $exists: true }
   }).sort({ createdAt: -1 }); // Get the latest budget

   if (!activeBudget) {
      return { allowed: true };
   }

   const { createdAt, duration } = activeBudget;
   const endDate = new Date(createdAt);
   endDate.setDate(endDate.getDate() + duration);

   const today = new Date();
   const remainingDays = differenceInDays(endDate, today);

   if (remainingDays > 0) {
      return { allowed: false, remainingDays };
   }

   return { allowed: true };
}

const getRemainingDays = (startDate: Date, duration: number): number => {
   const endDate = new Date(startDate);
   endDate.setDate(endDate.getDate() + duration);

   const today = new Date();
   const remainingDays = differenceInDays(endDate, today);

   return remainingDays > 0 ? remainingDays : 0; // Ensure it doesn't return negative days
}
