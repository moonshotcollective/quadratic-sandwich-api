import express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import Server from './src/api/v1/index';
import ContractEventService from './src/api/v1/services/ContractEventService';

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
