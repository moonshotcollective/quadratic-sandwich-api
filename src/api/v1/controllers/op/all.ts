import { RequestHandler } from 'express';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { Op } from '../../models/op.model';

const allOpsWrapper: RequestHandler = async (req, res) => {
    const op = await Op.find();
    res.status(200).json(op);
};

export const all = customRequestHandler(allOpsWrapper);
