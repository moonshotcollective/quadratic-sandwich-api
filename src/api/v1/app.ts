import express, { urlencoded, json } from 'express';
import { setupRoutes } from './routes';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Setup server routes

// Test the connection
app.use(json());
app.use(urlencoded({ extended: true }));
//  app.use(rateLimiter());
app.use(cors());
app.use(helmet()); // Use Helmet for security
app.disable('x-powered-by'); // Reduce fingerprinting


setupRoutes(app);
export default app;
