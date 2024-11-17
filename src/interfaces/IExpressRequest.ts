import { Request } from 'express';

export interface IExpressRequest extends Request {
  user: {
    [key: string]: string | undefined;
  }
}