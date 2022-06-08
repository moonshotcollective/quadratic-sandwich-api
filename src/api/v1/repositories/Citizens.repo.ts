import { Citizen } from '../models/citizen.model';

class CitizenRepo {
    constructor() {}

    getAllCitizens(options: any) {
        return ''; //Citizen.findAll(options);
    }

    getCitizenById(id: string) {
        return '';
    }
}

export default new CitizenRepo();
