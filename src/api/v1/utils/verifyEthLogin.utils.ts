import { utils } from 'ethers'; 

export const verifyEthLoginRequest = (loginRequest: IEthLoginRequest): boolean => {
    const message = 'Please sign this message to connect to the Optimism Collective.';
    return loginRequest.address === utils.verifyMessage(message, loginRequest.signature)
}