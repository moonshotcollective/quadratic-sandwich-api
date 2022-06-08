import { Router } from 'express';
import * as CitizenCtrl from '../controllers/citizen';

class CitizenRoutes {
    router = Router();

    constructor() {
        this.initializeCitizenRoutes();
    }

    private initializeCitizenRoutes() {
        this.router.route('/all').get(CitizenCtrl.all);
    }
}
export default new CitizenRoutes().router;
