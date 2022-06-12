import { Router } from 'express';
import * as OpCoCtrl from '../controllers/opco';

class OpCoRoutes { 
    router = Router(); 

    constructor() {
       this.initializeOpCoRoutes();  
    }

    private initializeOpCoRoutes() {
        this.router.route('/all').get(OpCoCtrl.all);
    }
}

export default new OpCoRoutes().router;