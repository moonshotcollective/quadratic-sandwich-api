import Joi from '@hapi/joi';
import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { Citizen } from '../../models/citizen.model';
import { validateJWT } from '../../utils/jwt.utils';

const updateCitizenSchema = Joi.object().keys({
    meta: Joi.object(),
    onboard: Joi.number(),
});

const updateCitizenWrapper: RequestHandler = async (req, res): Promise<void> => {
    try {
        let role = 'PUBLIC';
        if (req.headers.authorization) {
            const decodedToken = await validateJWT(req.headers.authorization);
            role = decodedToken.role;
            // only OP has this access
            if (role !== 'CITIZEN_ROLE') { // OPCO TOO? 
                const error = {
                    name: 'InvalidRole',
                    message: 'Invalid Role Access.',
                };
                res.send(401).send(error);
            }
            if (decodedToken.address !== req.query.address) {
                const error = {
                    name: 'InvalidAddress',
                    message: 'Invalid address param.',
                };
                res.status(400).send(error);
            }
        } else {
            throw {
                name: 'JWT Required',
                message: 'A JWT is required for authoriztion.',
            };
        }

        const query = { address: req.query.address };
        // todo: restrict fields
        const update = req.body;

        const opco = await Citizen.findOneAndUpdate(query, update, {
            new: true,
        }).exec();

        res.status(200).json(opco);
    } catch (error) {
        console.log({
            level: 'error',
            message: 'Error: Update OPCO failed.',
            error: error,
        });
        res.status(400);
    }
};

export const update = customRequestHandler(updateCitizenWrapper, { validation: {body: updateCitizenSchema}});
