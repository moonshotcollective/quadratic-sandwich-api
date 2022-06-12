import { Document } from 'mongoose';

export interface IOp extends Document {
    address: string; 
    ens: string;
}