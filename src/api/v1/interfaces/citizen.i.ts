import { Document } from 'mongoose';

export interface ICitizen extends Document {
    address: string; 
    ens: string;
    opco: string; 
    minted: boolean;
    delegatedTo: string; 
    votes: object; // TODO: Define voting interface
    meta: object; // TODO: Define citizen metadata interface
    onboard: number; 
}


/**
 * Citizens /citizen
Address
ENS
OpCo Address
Mint Status
Delegated to address
Voting Data
Metadata
 */