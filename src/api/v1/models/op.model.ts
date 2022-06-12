import { Model, Schema, model } from 'mongoose';
import { IOp } from '../interfaces/op.i';

interface IOpModel extends Model<IOp> {}

const opSchema = new Schema({
    address: { type: String, required: true },
    ens: { type: String },
});

export const Op: IOpModel = model<IOp, IOpModel>(
    'ops',
    opSchema,
);

