import { Application } from 'express';
import citizenRouter from './citizen.routes';
import loginRouter from './login.routes';

export default class Routes {

  constructor(app: Application) {
    // Login routes
    app.use(`/api/${process.env.API_VERSION}/login`, loginRouter);
    // Citizen reoutes
    app.use(`/api/${process.env.API_VERSION}/citizens`, citizenRouter);
  }
}