import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { Citizen } from '../../models/citizen.model';

const queryCitizensWrapper: RequestHandler = async (req, res) => {
    const citizen = await Citizen.find({ address: req.query.address }).exec();
    res.status(200).json(citizen);
};

export const query = customRequestHandler(queryCitizensWrapper);
