import { Application, urlencoded, json } from 'express';
import Routes from './routes';

export default class Server {
    constructor(app: Application) {
        this.config(app);
        new Routes(app);
    }

    public config(app: Application): void {
        app.use(urlencoded({ extended: true }))
        app.use(json());
        //  app.use(rateLimiter());
    }
}
process.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log('server startup error: address already in use');
    } else {
        console.log(err);
    }
});
