import { Router } from 'express';
import LoginCtrl from '../controllers/Login.ctrl';
import * as Auth from './../middlewares/auth.middleware';

class LoginRoutes {
    router = Router();
    loginCtrl = new LoginCtrl();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.route('/').post(Auth.authenticate); // Authenticate the user
        this.router.route('/authorize').get(Auth.authorize);
    }
}
export default new LoginRoutes().router;
