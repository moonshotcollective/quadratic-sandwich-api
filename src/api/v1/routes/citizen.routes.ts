import { Router } from 'express';
import * as CitizenCtrl from '../controllers/citizen';

class CitizenRoutes {
    router = Router();

    constructor() {
        this.initializeCitizenRoutes();
    }

    private initializeCitizenRoutes() {
        this.router.route('/all').get(CitizenCtrl.all);
        this.router.route('/:address?').get(CitizenCtrl.query);
    }
}
export default new CitizenRoutes().router;
