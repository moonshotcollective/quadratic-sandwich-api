import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { OPCO } from '../../models/opco.model';

const allOpCosWrapper: RequestHandler = async (req, res) => {
    const opcos = await OPCO.find();
    res.status(200).json(opcos);
};

export const all = customRequestHandler(allOpCosWrapper);
