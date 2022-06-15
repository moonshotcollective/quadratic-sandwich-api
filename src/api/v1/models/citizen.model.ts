import { Model, Schema, model } from 'mongoose';
import { ICitizen } from '../interfaces/citizen.i';
import { uniqueValidator } from '../validators/unique.validator'; 

interface ICitizenModel extends Model<ICitizen> {}

const citizenSchema = new Schema({
    address: { type: String, required: true, unique: true },
    ens: { type: String },
    opco: { type: String },
    minted: { type: Boolean },
    delegatedTo: { type: String },
    votes: { type: Object }, // TODO: Define voting interface
    meta: { type: Object }, // TODO: Define citizen metadata interface
});

citizenSchema.plugin(uniqueValidator); 

export const Citizen: ICitizenModel = model<ICitizen, ICitizenModel>(
    'citizens',
    citizenSchema,
);
