import { Router } from 'express';
import * as OpCtrl from '../controllers/op';

class OpCoRoutes { 
    router = Router(); 

    constructor() {
       this.initializeOpCoRoutes();  
    }

    private initializeOpCoRoutes() {
        this.router.route('/all').get(OpCtrl.all);
    }
}

export default new OpCoRoutes().router;