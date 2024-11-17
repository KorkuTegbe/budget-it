import { config } from "dotenv";
config()

import app from "./App";
import { Application } from "express";
import { connectMongo } from "./database";

//-----------------------------------------------
//-----------------------------------------------
//----------------Oyin's Budgeting app BACKEND SERVER-----------
//-----------------------------------------------
//-----------------------------------------------


export async function startServer(target: Application): Promise<void> {
   await connectMongo();
   // await connectRedis();
   target.listen(process.env.PORT, () => {
      console.log(`${process.env.NODE_ENV} ::: 🚀Server listening on PORT: ${process.env.PORT}`)
   })
}

startServer(app).catch((err) => {
   // TO DO
   // close database connection
   console.log('Server stopped', err)
})