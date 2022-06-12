import { Model, Schema, model } from 'mongoose';
import { IOpCo } from '../interfaces/opco.i';

interface IOpCoModel extends Model<IOpCo> {}

const opCoSchema = new Schema({
    address: { type: String, required: true },
    ens: { type: String },
    citizens: {type: Object },
    supply: { type: Number },
    allocated: {type: Number }, 
    minted: { type: Number }, 
    onboard: {type: Number}, 
    meta: { type: Object }, // TODO: Meta schema
});

export const OpCo: IOpCoModel = model<IOpCo, IOpCoModel>(
    'opcos',
    opCoSchema,
);

