import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { Citizen } from '../../models/citizen.model';

const allCitizensWrapper: RequestHandler = async (req, res) => {
    const citizens = await Citizen.find();
    res.status(200).json(citizens);
};

export const all = customRequestHandler(allCitizensWrapper);
