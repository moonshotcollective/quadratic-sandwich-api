import { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';

class LoginRoutes {
    router = Router();

    constructor() {
        this.initializeLoginRoutes();
    }

    private initializeLoginRoutes() {
        this.router.route('/').post(Auth.authenticate); // Authenticate the user
        this.router.route('/authorize').get(Auth.authorize);
    }
}
export default new LoginRoutes().router;
