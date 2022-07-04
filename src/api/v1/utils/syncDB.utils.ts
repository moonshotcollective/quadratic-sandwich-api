import * as dotenv from 'dotenv';
const env = dotenv.config();
if (env.error) {
    dotenv.config({ path: '.env' });
}
import { badgeContract, mainnetProvider } from '../config/contract.config';
import { Citizen } from '../models/citizen.model';
import { OPCO } from '../models/opco.model';

console.log({
    level: 'info',
    message: 'Syncing Database...',
});

const syncCitizens = async (): Promise<void> => {
    console.log({
        level: 'info',
        message: 'Syncing Citizens...',
    });
    const pageSize = 25;
    const ncits = await badgeContract.CitizenCount();
    let cursor = 0;
    while (cursor <= ncits) {
        const res = await badgeContract.getCitizens(cursor, pageSize);
        const parsedContractCitizens = await Promise.all(
            res[0].map(async (citizen: any) => {
                const ens = await mainnetProvider.lookupAddress(
                    citizen.citizen,
                );
                return new Citizen({
                    address: citizen.citizen,
                    ens: ens,
                    opco: citizen.opco,
                    minted: citizen.minted,
                    delegatedTo: null, // TODO: fix delegations
                    votes: { test: 1 },
                    meta: { test: 2 },
                });
            }),
        );
        console.log(parsedContractCitizens)
        for (let i = 0; i < parsedContractCitizens.length; i++) {
            try {
                // Save the citizen
                await parsedContractCitizens[i].save();
                // Update the OPCO with the citizen
                const opcoRes = await OPCO.findOne(
                    { address: parsedContractCitizens[i].opco },
                    'citizens',
                ).exec();
                if (opcoRes) {
                    const citizens = opcoRes?.citizens;
                    await OPCO.findOneAndUpdate(
                        {
                            address: parsedContractCitizens[i].opco,
                        },
                        {
                            citizens: [
                                ...citizens,
                                parsedContractCitizens[i]?.address,
                            ],
                            minted: parsedContractCitizens[i].minted, // Update the minted status - IMPROVE ME
                        },
                    ).exec();
                }
            } catch (error) {
                console.log(error)
            }
        }

        cursor = res.newCursor.toNumber();
    }
};

const syncOPCOs = async (): Promise<void> => {
    console.log({
        level: 'info',
        message: 'Syncing OPCOs...',
    });
    const pageSize = 25;
    const nopcos = await badgeContract.OPCOCount();
    let cursor = 0;
    while (cursor <= nopcos) {
        const res = await badgeContract.getOPCOs(cursor, pageSize);
        const parsedContractOPCOs = await Promise.all(
            res[0].map(async (opco: any) => {
                const ens = await mainnetProvider.lookupAddress(opco.co);
                return new OPCO({
                    address: opco.co,
                    ens: ens,
                    citizens: opco.citizens,
                    supply: opco.supply,
                    allocated: opco.allocated,
                    minted: opco.minted,
                    onboard: 0,
                    meta: {},
                });
            }),
        );
        console.log(parsedContractOPCOs)
        for (let i = 0; i < parsedContractOPCOs.length; i++) {
            // Save the OPCO
            try {
                await parsedContractOPCOs[i].save();
            } catch (error) {
                console.log(error)
                
            }
        }
        cursor = res.newCursor.toNumber();
    }
};

syncCitizens();
syncOPCOs();

console.log({
    level: 'info',
    message: 'Sync Complete...',
});
