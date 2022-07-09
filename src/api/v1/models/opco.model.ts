import { Model, Schema, model } from 'mongoose';
import { IOPCO } from '../interfaces/opco.i';
import { uniqueValidator } from '../validators/unique.validator';

interface IOPCOModel extends Model<IOPCO> {}

const opcoSchema = new Schema({
    address: { type: String, required: true, unique: true },
    ens: { type: String },
    citizens: {type: Array },
    supply: { type: Number },
    allocated: {type: Number }, 
    minted: { type: Number }, 
    onboard: {type: Number}, 
    meta: { type: Object }, // TODO: Meta schema
});

opcoSchema.plugin(uniqueValidator); 

export const OPCO: IOPCOModel = model<IOPCO, IOPCOModel>(
    'opcos',
    opcoSchema,
);

