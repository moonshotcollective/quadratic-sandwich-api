import { providers, Contract } from 'ethers';

export default class ContractEventService {

    provider = new providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
    badgeAddress = process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : '0'; // Fallback ? 
    badgeAbi = [
        "event SetCitizens(address indexed sender, address[] citizens)"
      ];
    badgeContract = new Contract(this.badgeAddress, this.badgeAbi, this.provider);

    constructor() {
        this.initializeCitizenService();
    }

    initializeCitizenService() {
        this.badgeContract.on('SetCitizens', (): void => {
            console.log("Citizens Set");
        })
    }
}

