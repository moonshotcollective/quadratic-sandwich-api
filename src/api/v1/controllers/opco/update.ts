import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { OPCO } from '../../models/opco.model';

const updateOPCOWrapper: RequestHandler = async (req, res) => {
    const query = { address: req.query.address };
    const update = req.body;
    console.log(req.body);
    const opco = await OPCO.findOneAndUpdate(query, update, {
        new: true,
    }).exec();
    res.status(200).json(opco);
};

export const update = customRequestHandler(updateOPCOWrapper);
