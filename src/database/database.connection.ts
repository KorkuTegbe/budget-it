import mongoose from "mongoose";
import { config } from "../constants";


export async function connectMongo() {
    const connectionString = config.mongodb.uri
    mongoose.connect(connectionString);

    mongoose.connection.on('connected', () => {
        console.info('Mongo Connection Established')
    })

    mongoose.connection.on('error', (err) => {
        console.error(`Mongo Connection Error ${err}`)
    })

    mongoose.connection.on('disconnected', () => {
        // Logger.Error('Mongo connection disconnected')
        console.error('Mongo Connection Disconnected')
        process.exit(1)
    })

    // If node process ends, close the mongoose connection
    process.on('SIGINT', async () => {
        try {
            // Logger.Error('Mongoose default connection disconnected through app termination')
            await mongoose.connection.close(true)
            console.info('Mongoose default connection disconnected through app termination')
        } catch (err) {
            console.error('Could not close Mongoose Connection');
            console.error(err)
        }
        process.exit(0);
    });

};