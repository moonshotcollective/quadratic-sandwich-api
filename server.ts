import express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
    dotenv.config({ path: '.env' });
}

import Server from './src/api/v1/index';
import ContractEventService from './src/api/v1/services/ContractEvents.service';
import { generateJWT } from './src/api/v1/utils/jwt.utils';
import MongoConnection from './src/api/v1/config/db.config';

// Only generate a token for lower level environments
if (process.env.NODE_ENV !== 'production') {
    // console.log('JWT', generateJWT());
}

// Start the Contract Services
const contractEventService = new ContractEventService();

const dbConnection = new MongoConnection(
    process.env.MONGO_URI ? process.env.MONGO_URI : '',
);

// Express API
const app: Application = express();
const server: Server = new Server(app);
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const host: string = 'localhost';

dbConnection.connect(() => {
    app.listen(port, host, () => {
        console.log({
            level: 'info',
            message: `🌏 Express server started on http://${host}:${port}`,
        });
    }).on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            console.log({
                level: 'error',
                message: 'server startup error: address already in use',
                error: err,
            });
        } else {
            console.log(err);
        }
    });
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
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
