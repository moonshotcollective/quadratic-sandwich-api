import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import { customRequestHandler } from '../../middlewares/request.middleware';
import { Citizen } from '../../models/citizen.model';

export const addCitizenSchema = Joi.object().keys({
    address: Joi.string().required(),
    ens: Joi.string(),
    opco: Joi.string(),
    minted: Joi.boolean(),
    delegatedTo: Joi.string(),
    votes: Joi.object(),
    meta: Joi.object(),
    onboard: Joi.number(),
});

const addCitizenWrapper: RequestHandler = async (req, res) => {
    const { address, ens, opco, minted, delegatedTo, votes, meta } = req.body;
    const citizen = new Citizen({
        address,
        ens,
        opco,
        minted,
        delegatedTo,
        votes,
        meta,
    });

    await citizen.save();
    res.status(201).json(citizen.toJSON());
};

export const add = customRequestHandler(addCitizenWrapper, {
    validation: { body: addCitizenSchema },
});
