import mongoose from 'mongoose';
import { parse } from 'path';
import {
    badgeContract,
    mainnetProvider,
    provider,
} from '../../config/contract.config';
import { IOPCO } from '../../interfaces/opco.i';
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
                const ens = await mainnetProvider.lookupAddress(adr);
                return new Citizen({
                    address: adr,
                    ens: ens,
                    opco: citizen.opco,
                    minted: false,
                    delegatedTo: null,
                    votes: { test: 1 },
                    meta: { test: 2 },
                    onboard: 0,
                });
            }),
        );
        // Find a better way to skip over errors using batch insertions
        for (let i = 0; i < parsedContractCitizens.length; i++) {
            try {
                // Save the citizen
                await parsedContractCitizens[i].save();
                // Update the OPCO with the citizen
                const opcoRes = await OPCO.findOne({
                    address: parsedContractCitizens[i].opco,
                }).exec();
                if (opcoRes) {
                    const citizens = opcoRes?.citizens;
                    let onboard = 2;
                    if (citizens.length === opcoRes.supply) {
                        onboard = 3;
                    }
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
                            onboard: onboard,
                        },
                    ).exec();
                }
            } catch (error) {
                console.log({
                    level: 'error',
                    info: 'Error saving Citizen',
                    error: error,
                });
                if (error instanceof mongoose.Error.ValidationError) {
                    // TODO: more specific error handling
                    console.log({
                        level: 'info',
                        info: 'Add Citizen: Citizen already exists, updating instead...',
                    });
                    const opcoRes = await OPCO.findOne({
                        address: parsedContractCitizens[i].opco,
                    }).exec();
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
