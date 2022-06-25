import mongoose from 'mongoose';
import { badgeContract } from '../../config/contract.config';
import { OPCO } from '../../models/opco.model';

export const handleOPCOsAdded = async (
    _op: string,
    _lastCursor: number,
    _opcos: string[],
): Promise<void> => {
    try {
        console.log({
            level: 'info',
            message: `OPCo's Added: ${_op}, Last Index: ${_lastCursor}, Addresses: ${_opcos}`,
        });

        const parsedContractOPCOs = await Promise.all(
            _opcos.map(async (adr: string) => {
                const opco = await badgeContract.getOPCO(adr);
                return new OPCO({
                    address: opco.co,
                    ens: '',
                    citizens: opco.citizens,
                    supply: opco.supply.toNumber(),
                    minted: opco.minted.toNumber(),
                    onboard: 0,
                    meta: {
                        name: 'test1',
                        description: 'testdescription',
                        profileImg: 'img',
                        headerImg: 'img',
                    },
                });
            }),
        );

        for (let i = 0; i < parsedContractOPCOs.length; i++) {
            try {
                await parsedContractOPCOs[i].save();
            } catch (error) {
                console.log({
                    level: 'error',
                    info: 'Error saving OPCO',
                    error: error,
                });
                if (error instanceof mongoose.Error.ValidationError) {
                    console.log({
                        level: 'info',
                        info: 'Add OPCO: OPCO already exists. Updating instead...',
                    });
                    await OPCO.findOneAndUpdate(
                        { address: parsedContractOPCOs[i].address },
                        {
                            citizens: parsedContractOPCOs[i].citizens,
                            supply: parsedContractOPCOs[i].supply,
                            minted: parsedContractOPCOs[i].minted,
                        },
                    ).exec();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};
