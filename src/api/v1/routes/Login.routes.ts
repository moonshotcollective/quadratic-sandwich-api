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
        this.router.route('/login').get(Auth.authorize(), this.loginCtrl.login);
    }
}
export default new LoginRoutes().router;
