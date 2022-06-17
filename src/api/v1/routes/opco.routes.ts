import { Router } from 'express';
import * as OPCOCtrl from '../controllers/opco';

class OPCORoutes { 
    router = Router(); 

    constructor() {
       this.initializeOpCoRoutes();  
    }

    private initializeOpCoRoutes() {
        this.router.route('/all').get(OPCOCtrl.all);
        this.router.route('/:address?').get(OPCOCtrl.query);
        // This needs to be restricted to the OP role 
        this.router.route('/update/:address?').post(OPCOCtrl.update);
    }
}

export default new OPCORoutes().router;