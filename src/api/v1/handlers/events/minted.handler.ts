import mongoose from 'mongoose';
import { badgeContract, mainnetProvider } from '../../config/contract.config';
import { Citizen } from '../../models/citizen.model';
import { OPCO } from '../../models/opco.model';

export const handleMinted = async (
    _minter: string,
    _opco: string,
): Promise<void> => {
    try {
        console.log({
            level: 'info',
            message: `Citizen Minted: ${_minter}`,
        });

        const citizenBalance = await badgeContract.balanceOf(_minter);
        console.log(citizenBalance)

        if (citizenBalance.toNumber() === 1) {
            const res = await Citizen.findOneAndUpdate(
                { address: _minter },
                { minted: true, onboard: 1 },
            ).exec();
        }
    } catch (error) {
        console.log({
            level: 'error',
            message: `Error: Citizen Mint: ${_minter}`,
            error: error,
        });
    }
};
