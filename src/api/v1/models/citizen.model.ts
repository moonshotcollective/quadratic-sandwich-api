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
    onboard: { type: Number },
});

citizenSchema.plugin(uniqueValidator);

// Function to handle Error code 11000 for duplicate entries
const handleError11000 = (error: any, doc: any, next: any) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate entry'));
    } else {
        next(error);
    }
}

citizenSchema.post('save', handleError11000);

// citizenSchema.post('save', (error: any, doc: any, next: any) => {
//     console.log("HEYYYYYYYYYYYYYYYY\n");
//     if (error.name === 'MongoServerError' && error.code === 11000) {
//         next(new Error(`There was a duplicate key error`));
//     } else {
//         next(error);
//     }
// });

export const Citizen: ICitizenModel = model<ICitizen, ICitizenModel>(
    'citizens',
    citizenSchema,
);
