import express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import Server from './src/api/v1/index';
import ContractEventService from './src/api/v1/services/ContractEvents.service';
import { generateJWT } from './src/api/v1/utils/jwt.utils';

// Only generate a token for lower level environments
if (process.env.NODE_ENV !== 'production') {
    console.log('JWT', generateJWT());
}

// Start the Contract Services
const contractEventService = new ContractEventService();

// Express API
const app: Application = express();
const server: Server = new Server(app);
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const host: string = 'localhost';

app.listen(port, host, () => {
    console.log(`Server started on http://${host}:${port}`);
}).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log('server startup error: address already in use');
    } else {
        console.log(err);
    }
});
