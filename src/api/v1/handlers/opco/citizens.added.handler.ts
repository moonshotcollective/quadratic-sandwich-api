import mongoose from 'mongoose';
import { badgeContract } from '../../config/contract.config';
import { Citizen } from '../../models/citizen.model';
import { OPCO } from '../../models/opco.model';

export const handleCitizensAdded = async (
    _opco: string,
    _lastCursor: number,
    _citizens: string[],
): Promise<void> => {
    try {
        console.log({
            level: 'info',
            message: `Citizens set by: ${_opco}, `,
        });

        const parsedContractCitizens = await Promise.all(
            _citizens.map(async (adr: string) => {
                const citizen = await badgeContract.getCitizen(adr);
                return new Citizen({
                    address: adr,
                    ens: '',
                    opco: citizen.opco,
                    minted: false,
                    delegatedTo: null,
                    votes: { test: 1 },
                    meta: { test: 2 },
                });
            }),
        );
        // Find a better way to skip over errors using batch insertions
        for (let i = 0; i < parsedContractCitizens.length; i++) {
            try {
                await parsedContractCitizens[i].save();
            } catch (error) {
                console.log({
                    level: 'error',
                    info: 'Error saving Citizen',
                    error: error,
                });
                if (error instanceof mongoose.Error.ValidationError) { // TODO: more specific error handling
                    console.log({
                        level: 'info',
                        info: 'Add Citizen: Citizen already exists, updating instead...',
                    });
                    await OPCO.findOneAndUpdate(
                        {
                            address: parsedContractCitizens[i].address,
                        },
                        {
                            minted: parsedContractCitizens[i].minted, // Update the minted status - IMPROVE ME
                        },
                    ).exec();
                }
            }
        }
    } catch (error) {
        console.log({
            level: 'error',
            message: `Citizens Error`,
            error: error,
        });
    }
};
