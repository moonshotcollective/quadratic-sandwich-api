import { badgeContract } from '../config/contract.config';
import { Citizen } from '../models/citizen.model';

export const syncDB = async (): Promise<void> => {
    console.log({
        level: 'info',
        message: 'Syncing Database...',
    });
    const pageSize = 25; 
    const ncits = await badgeContract.CitizenCount();
    let cursor = 0; 
    while (cursor <= ncits) {
        const res = await badgeContract.getCitizens(cursor, pageSize);
        const parsedContractCitizens = await Promise.all(res[0].map((citizen: any) => {
            return new Citizen({
                address: citizen.citizen,
                ens: '',
                opco: citizen.opco,
                minted: citizen.minted,
                delegatedTo: null, // TODO: fix delegations
                votes: { test: 1 },
                meta: { test: 2 },
            });
        })
    
        )
        console.log(parsedContractCitizens)
        cursor = res.newCursor.toNumber();
    }
        
};
