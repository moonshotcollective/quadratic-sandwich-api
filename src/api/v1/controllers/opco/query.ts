import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { OPCO } from '../../models/opco.model';

const queryCitizensWrapper: RequestHandler = async (req, res) => {
    const opco = await OPCO.find({ address: req.query.address }).exec();
    res.status(200).json(opco);
};

export const query = customRequestHandler(queryCitizensWrapper);
