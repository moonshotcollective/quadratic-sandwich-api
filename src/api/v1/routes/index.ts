import { Application } from 'express';
import opRouter from './op.routes';
import opCoRouter from './opco.routes';
import citizenRouter from './citizen.routes';
import loginRouter from './login.routes';

export const setupRoutes = (app: Application): Application => {
      // Login routes
      app.use(`/api/${process.env.API_VERSION}/login`, loginRouter);
      // Op routes
      app.use(`/api/${process.env.API_VERSION}/op`, opRouter);
      // OpCo routes
      app.use(`/api/${process.env.API_VERSION}/opco`, opCoRouter);
      // Citizen routes
      app.use(`/api/${process.env.API_VERSION}/citizen`, citizenRouter);
      return app;
}