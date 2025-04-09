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

// export const getSpendingAnalytics = async (userId: string): Promise<IService> => {
//    try {

//       return {
//          status: 200,
//          success: true,
//          message: ''
//       }
//    } catch (error: any) {
//       return {
//          status: error.statusCode,
//          success: false,
//          message: error.message
//       };
//    }
// }

/** ############################################ */

// export const getSpendingAnalytics = async (userId: string): Promise<IService> => {
//    try {
//       // Get all spendings for the user
//       const spendings = await SpendingDb.find({ user: userId });
//       console.log(spendings)
//       if (spendings.length === 0) {
//          return {
//             status: 200,
//             success: true,
//             message: 'No spendings yet',
//             data: {}
//          };
//       }

//       // Total amount spent
//       const totalSpent = spendings.reduce((sum, s) => sum + s.amount, 0);

//       // Spending per category
//       const spendingByCategory: Record<string, number> = {};
//       spendings.forEach(s => {
//          const category = s.category.toUpperCase();
//          spendingByCategory[category] = (spendingByCategory[category] || 0) + s.amount;
//       });

//       // Average spending
//       const averageSpending = totalSpent / spendings.length;

//       // Spending over time (optional: by day or month)
//       const spendingOverTime: Record<string, number> = {};
//       spendings.forEach(s => {
//          // @ts-ignore
//          const dateKey = new Date(s.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
//          spendingOverTime[dateKey] = (spendingOverTime[dateKey] || 0) + s.amount;
//       });

//       return {
//          status: 200,
//          success: true,
//          message: 'Analytics generated successfully',
//          data: {
//             totalSpent,
//             averageSpending,
//             totalTransactions: spendings.length,
//             spendingByCategory,
//             spendingOverTime
//          }
//       };
//    } catch (error: any) {
//       return {
//          status: error.statusCode || 500,
//          success: false,
//          message: error.message
//       };
//    }
// }

/** export interface SpendingAnalyticsQuery {
   from?: string; // ISO date string
   to?: string;   // ISO date string
   category?: string;
}

export const getSpendingAnalytics = async (
   userId: string,
   query: SpendingAnalyticsQuery = {}
): Promise<IService> => {
   try {
      const matchStage: any = { user: userId };

      if (query.from || query.to) {
         matchStage.createdAt = {};
         if (query.from) matchStage.createdAt.$gte = new Date(query.from);
         if (query.to) matchStage.createdAt.$lte = new Date(query.to);
      }

      if (query.category) {
         matchStage.category = query.category.toUpperCase();
      }

      const pipeline = [
         { $match: matchStage },
         {
            $group: {
               _id: '$category',
               totalAmount: { $sum: '$amount' },
               transactions: { $sum: 1 }
            }
         },
         {
            $group: {
               _id: null,
               totalSpent: { $sum: '$totalAmount' },
               totalTransactions: { $sum: '$transactions' },
               categories: {
                  $push: {
                     category: '$_id',
                     amount: '$totalAmount',
                     count: '$transactions'
                  }
               }
            }
         },
         {
            $project: {
               _id: 0,
               totalSpent: 1,
               totalTransactions: 1,
               averageSpending: {
                  $cond: [
                     { $eq: ['$totalTransactions', 0] },
                     0,
                     { $divide: ['$totalSpent', '$totalTransactions'] }
                  ]
               },
               spendingByCategory: '$categories'
            }
         }
      ];

      const analytics = await SpendingDb.aggregate(pipeline);

      return {
         status: 200,
         success: true,
         message: 'Analytics generated successfully',
         data: analytics[0] || {
            totalSpent: 0,
            totalTransactions: 0,
            averageSpending: 0,
            spendingByCategory: []
         }
      };
   } catch (error: any) {
      return {
         status: error.statusCode || 500,
         success: false,
         message: error.message
      };
   }
};
*/

export interface SpendingAnalyticsQuery {
   from?: string; // ISO date string
   to?: string;   // ISO date string
   category?: string;
   groupBy?: 'day' | 'week' | 'month'; // Optional time grouping
}

export const getSpendingAnalytics = async (
   userId: string,
   query: SpendingAnalyticsQuery = {}
): Promise<IService> => {
   try {
      const matchStage: any = { user: userId };

      if (query.from || query.to) {
         matchStage.createdAt = {};
         if (query.from) matchStage.createdAt.$gte = new Date(query.from);
         if (query.to) matchStage.createdAt.$lte = new Date(query.to);
      }

      if (query.category) {
         matchStage.category = query.category.toUpperCase();
      }

      const groupFormatMap = {
         day: '%Y-%m-%d',
         week: '%Y-%U',     // year-weekNumber
         month: '%Y-%m'
      };

      const dateFormat = groupFormatMap[query.groupBy || 'day'];

      const pipeline = [
         { $match: matchStage },

         // Spending by time
         {
            $facet: {
               overall: [
                  {
                     $group: {
                        _id: '$category',
                        totalAmount: { $sum: '$amount' },
                        transactions: { $sum: 1 }
                     }
                  },
                  {
                     $group: {
                        _id: null,
                        totalSpent: { $sum: '$totalAmount' },
                        totalTransactions: { $sum: '$transactions' },
                        categories: {
                           $push: {
                              category: '$_id',
                              amount: '$totalAmount',
                              count: '$transactions'
                           }
                        }
                     }
                  },
                  {
                     $project: {
                        _id: 0,
                        totalSpent: 1,
                        totalTransactions: 1,
                        averageSpending: {
                           $cond: [
                              { $eq: ['$totalTransactions', 0] },
                              0,
                              { $divide: ['$totalSpent', '$totalTransactions'] }
                           ]
                        },
                        spendingByCategory: '$categories'
                     }
                  }
               ],
               overTime: [
                  {
                     $group: {
                        _id: {
                           $dateToString: {
                              format: dateFormat,
                              date: '$createdAt'
                           }
                        },
                        totalAmount: { $sum: '$amount' }
                     }
                  },
                  { $sort: { _id: 1 } }
               ]
            }
         },
         {
            $project: {
               overall: { $arrayElemAt: ['$overall', 0] },
               spendingOverTime: '$overTime'
            }
         }
      ];
      // @ts-ignore
      const analytics = await SpendingDb.aggregate(pipeline);

      return {
         status: 200,
         success: true,
         message: 'Analytics generated successfully',
         data: analytics[0] || {
            overall: {
               totalSpent: 0,
               totalTransactions: 0,
               averageSpending: 0,
               spendingByCategory: []
            },
            spendingOverTime: []
         }
      };
   } catch (error: any) {
      return {
         status: error.statusCode || 500,
         success: false,
         message: error.message
      };
   }
};

