import { Router } from 'express';
import CitizenCtrl from '../controllers/CitizenCtrl';

class CitizenRoutes {
    router = Router(); 
    citizenCtrl = new CitizenCtrl();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() { 
        this.router.route('/').get(this.citizenCtrl.getAllCitizens);
        this.router.route('/:id').get(this.citizenCtrl.getCitizen);
    }
}
export default new CitizenRoutes().router;