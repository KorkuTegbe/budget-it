import Joi from 'joi'
import { Request, Response, NextFunction } from 'express';

const signUpInput = Joi.object({
   name: Joi.string()
      .alphanum()
      .trim()
      .min(3)
      .required(),
   email: Joi.string().email().trim(),
   password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .trim()
      .min(8)
      .required(),
})

const loginInput = Joi.object({
   email: Joi.string().email().trim(),
   password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(8)
      .trim()
      .required(),
})

const blogPostInput = Joi.object({
   title: Joi.string()
      .min(3)
      .trim()
      .required(),
   content: Joi.string()
      .min(3)
      .required()
})

const commentInput = Joi.object({
   author: Joi.string()
      .trim()
      .min(3),
   comment: Joi.string()
      .min(3)
      .trim()
      .required()
})

// validation middleware
export const userSignUpValidation = async (req: Request, res: Response, next: NextFunction) => {
   const userPayload = req.body;
   try{
      await signUpInput.validateAsync(userPayload);
      next()
   } catch(error: any){
      next({
         message: error.details[0].message,
         status: 400,
      });
   };
};

export const userLoginValidation = async (req: Request, res: Response, next: NextFunction) => {
   const userPayload = req.body;
   try{
      await loginInput.validateAsync(userPayload);
      next()
   } catch(error: any){
      next({
         message: error.details[0].message,
         status: 400,
      });
   };
};

export const blogPostInputValidation = async (req: Request, res: Response, next: NextFunction) => {
   const userPayload = req.body;
   try{
      await blogPostInput.validateAsync(userPayload);
      next()
   } catch(error: any){
      next({
         message: error.details[0].message,
         status: 400,
      });
   };
};

export const commentInputValidation = async (req: Request, res: Response, next: NextFunction) => {
   const userPayload = req.body;
   try{
      await commentInput.validateAsync(userPayload);
      next()
   } catch(error: any){
      next({
         message: error.details[0].message,
         status: 400,
      });
   };
};

// .pattern(/^[a-zA-Z0-9\s\W]*$/).messages({
//    'string.pattern.base': 'The value must be alphanumeric and can include spaces and symbols.'
// })