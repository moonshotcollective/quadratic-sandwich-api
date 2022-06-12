import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { OpCo } from '../../models/opco.model';

const allOpCosWrapper: RequestHandler = async (req, res) => {
    const opcos = await OpCo.find();
    res.status(200).json(opcos);
};

export const all = customRequestHandler(allOpCosWrapper);
