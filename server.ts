import * as dotenv from 'dotenv';
const env = dotenv.config();
if (env.error) {
    dotenv.config({ path: '.env' });
}
import express from 'express';
import { Application } from 'express';
import Server from './src/api/v1/index';
import ContractEventService from './src/api/v1/services/ContractEvents.service';
import MongoConnection from './src/api/v1/config/db.config';

// Establish the Contract Services
const contractEventService = new ContractEventService();

// Establish the DB connection
const dbConnection = new MongoConnection(
    process.env.MONGO_URI ? process.env.MONGO_URI : '', // FIXME: Add fallback URI
);

// Establish Express API
const app: Application = express();
const server: Server = new Server(app);
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const host: string = 'localhost';

// Start the Application
dbConnection.connect((): void => {
    app.listen(port, host, (): void => {
        console.log({
            level: 'info',
            message: `🌏 Express server started on http://${host}:${port}`,
        });
    }).on('error', (err: any): void => {
        if (err.code === 'EADDRINUSE') {
            console.log({
                level: 'error',
                message: 'Server startup error: address already in use',
                error: err,
            });
        } else {
            console.log(err);
        }
    });
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', (): void => {
    console.info('\nGracefully shutting down');
    dbConnection.close(err => {
        if (err) {
            console.log({
                level: 'error',
                message: 'Error shutting closing mongo connection',
                error: err,
            });
        }
        process.exit(0);
    });
});
