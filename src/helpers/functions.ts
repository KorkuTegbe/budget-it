import crypto from 'crypto';
import { userDb } from '../database';

export const generateUsername = async (firstName: string, lastName: string): Promise<string> => {
   const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}_`.slice(0, 12); 
   const randomSuffix = crypto.randomBytes(2).toString('hex'); 
   const username = `${baseUsername}${randomSuffix}`;

   // Check if username is unique in the database
   const existingUser = await userDb.findOne({ username });
   if (existingUser) {
      // Retry with a new suffix if there's a conflict
      return generateUsername(firstName, lastName);
   }

   return username;
}


export const generateAccountNumber = async (phoneNumber: string) => {
   const accountNumber = phoneNumber.substring(1);
   return accountNumber;
}

