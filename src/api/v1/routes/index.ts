import { Application } from 'express';
import citizenRouter from './Citizen.routes';
import loginRouter from './Login.routes';

export default class Routes {

  constructor(app: Application) {
    // Login routes
    app.use('/api/login', loginRouter);
    // Citizen reoutes
    app.use('/api/citizens', citizenRouter);
  }
}