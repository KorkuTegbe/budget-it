import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as swagger from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import { swaggerSpec } from './configuration/';
import { AppErrorHandler } from './exceptions';
import { AuthRouter, BudgetRouter, SavingsRouter,  } from './routers';

const app = express();

app.use(morgan('combined'));

app.use(cors());

app.use((...args: [Request, Response, NextFunction]) => {
   const [req, res, next] = args;
   app.disable('x-powered-by');
   res['setHeader']('X-Powered-By', `Blog server v1.0.0`);
   next();
});

app.use(
   rateLimit({
      windowMs: 1000 * 60 * 60,
      max: +<string>process.env.RATE_LIMIT_MAX,
      message: 'Too many request created from this IP, please try again in an hour time'
   })
);

app.use(bodyParser.json({ limit: '5mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb', parameterLimit: 5 }));

app.get('/', (req, res) => {
   res.json({
      message: `thanks for visiting BLOGGEE. You should check the docs`
   })
})

// /**swagger js docs*/
app.use('/docs', swagger.serve, swagger.setup(swaggerSpec));

app.use(AuthRouter);
app.use(BudgetRouter);
app.use(SavingsRouter);


/**eGlobal error handler */
app.use(AppErrorHandler);

export default app;