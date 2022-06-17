import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { Citizen } from '../../models/citizen.model';
import { validateJWT } from '../../utils/jwt.utils';

const updateCitizenWrapper: RequestHandler = async (req, res): Promise<void> => {
    try {
        let role = 'PUBLIC';
        if (req.headers.authorization) {
            const decodedToken = await validateJWT(req.headers.authorization);
            role = decodedToken.role;
            // only OP has this access
            if (role !== 'CITIZEN') {
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
                res.status(401).send(error);
            }
        } else {
            throw {
                name: 'JWT Required',
                message: 'A JWT is required for authoriztion.',
            };
        }

        const query = { address: req.query.address };
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
        res.status(500).send(error);
    }
};

export const update = customRequestHandler(updateCitizenWrapper);
