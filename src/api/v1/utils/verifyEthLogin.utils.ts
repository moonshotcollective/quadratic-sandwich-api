import { link } from '@hapi/joi';
import { utils } from 'ethers'; 
import { IEthLoginRequest } from '../interfaces/ethLoginRequest.i';

export const verifyEthLoginRequest = (loginRequest: IEthLoginRequest): boolean => {
    const message = 'Please sign this message to connect to the Optimism Collective.';
    if (loginRequest?.address && loginRequest?.signature) {
        return loginRequest.address === utils.verifyMessage(message, loginRequest.signature)
    } 
    return false;
}