import { Document } from 'mongoose';

export interface IOPCO extends Document {
    address: string; 
    ens: string;
    citizens: string[]; 
    supply: number;
    allocated: number; 
    minted: number; 
    onboard: number; 
    meta: {
        name: string; 
        description: string;
        profileImg: string; 
        headerImg: string;
    }
}

// OpCo	/opco/address/ & /opco/address/{subset}
// Address 
// ENS
// Citizens
// Supply
// Allocated
// Minted
// Onboarding Status - number (0 to 3)
// Meta data: 
// OpCo Name
// Description
// Profile Image
// Header Image
