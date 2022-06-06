import { Request, Response, NextFunction } from 'express';
import CitizenRepo from '../repositories/Citizens.repo';
import { apiErrorHandler } from '../handlers/error.handler';

export default class CitizenCtrl {
    constructor() {}

    async getAllCitizens(req: Request, res: Response, next: NextFunction) {
        try {
            const citizenList = await CitizenRepo.getAllCitizens({});
        } catch (error) {
            apiErrorHandler(
                error,
                req,
                res,
                'Error: Fetch All Citizens failed.',
            );
        }
    }

    async getCitizen(req: Request, res: Response, next: NextFunction) {
        try {
            const citizenDetails = await CitizenRepo.getCitizenById(
                req.params.id,
            );
            if (citizenDetails) {
                return res.json(citizenDetails);
            } else {
                res.status(404).send(`Citizen ${req.params.id} not found.`);
            }
        } catch (error) {
            apiErrorHandler(
                error,
                req,
                res,
                `Error: Get citizen ${req.params.id} has failed.`,
            );
        }
    }
}
