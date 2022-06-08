import { providers, Contract } from 'ethers';

export default class ContractEventService {
    private provider = new providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
    private badgeAddress = process.env.CONTRACT_ADDRESS
        ? process.env.CONTRACT_ADDRESS
        : '0'; // Fallback ?
    private badgeAbi = [
        'event SetCitizens(address indexed sender, address[] citizens)',
    ];
    private badgeContract = new Contract(
        this.badgeAddress,
        this.badgeAbi,
        this.provider,
    );

    constructor() {
        console.log({
            level: 'info',
            message: `Starting Contract Event Service on ${this.badgeAddress}`,
        });
        this.initializeContractEventService();
    }

    initializeContractEventService() {
        this.badgeContract.on(
            'SetCitizens',
            (sender: string, citizens: string[]): void => {
                console.log({
                    level: 'info',
                    message: `Citizens set: ${sender}, ${citizens}`,
                });
            },
        );
    }
}
