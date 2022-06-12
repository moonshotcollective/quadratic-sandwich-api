import { Application, urlencoded, json } from 'express';
import Routes from './routes';
import cors from 'cors';
import helmet from 'helmet';

export default class Server {
    constructor(app: Application) {
        this.config(app);
        new Routes(app);
    }

    public config(app: Application): void {
        app.use(json());
        app.use(urlencoded({ extended: true }));
        //  app.use(rateLimiter());
        app.use(cors());
        app.use(helmet()); // Use Helmet for security
        app.disable('x-powered-by'); // Reduce fingerprinting
    }
}
process.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log('server startup error: address already in use');
    } else {
        console.log(err);
    }
});
