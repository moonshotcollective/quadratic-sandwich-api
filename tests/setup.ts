// mock db setup
import mongoose, { Mongoose, MongooseOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express, { Application } from 'express';
import MongoConnection from '../src/api/v1/config/db.config';
import Server from '../src/api/v1';


/**
 * Connect to mock memory db.
 */
export const app = express();
export const server = new Server(app);
let mongod: MongoMemoryServer;
let configuredDb: MongoConnection;
let dbConn: mongoose.Connection;
let serverConn: any;

export const connect = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    configuredDb = new MongoConnection(uri);
    dbConn = await configuredDb.connect(
       startServer  
    );
}

export const closeConnection = async () => {
    serverConn.close();
}

/**
 * Close db connection
 */
export const closeDatabase = async () => {
    await dbConn.dropDatabase();
    await dbConn.close();
    await configuredDb.close(() => {console.log('db closed')});
}

/**
 * Delete db collections
 */
export const clearDatabase = async () => {
    const collections = dbConn.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

export const startServer = () => {
        serverConn = app.listen(8080, (): void => {
            console.log({
                level: 'info',
                message: `🌏 Express server started on http://localhost:8080`,
            }); 
        })
}
