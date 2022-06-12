import { providers, Contract } from 'ethers';
import { Citizen } from '../models/citizen.model';

export default class ContractEventService {
    private provider = new providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
    private mainnetProvider = new providers.JsonRpcProvider(process.env.MAINNET_RPC_ENDPOINT);
    private badgeAddress = process.env.CONTRACT_ADDRESS
        ? process.env.CONTRACT_ADDRESS
        : '0'; // Fallback ?
    private badgeAbi = [
        'event SetCitizens(address indexed sender, address[] citizens)',
        'function getOpCoCitizens(address _opco) public view returns (address[] memory)'
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
        this.setCitizenEventHandler();
    }

    private setCitizenEventHandler() { 
        this.badgeContract.on(
            'SetCitizens',
            async (sender: string, citizens: string[]): Promise<void> => {
                try {
                    console.log({
                        level: 'info',
                        message: `Citizens set: ${sender}, ${citizens}`,
                    });

                    const opCoCitizens = await this.badgeContract.getOpCoCitizens(sender);
                    console.log(opCoCitizens)


                    // TODO: Check for duplicated entries and ignore those

                    for (let i = 0; i < opCoCitizens.length; i++) {
                        const address = opCoCitizens[i];
                        console.log(address);
                        const ens = await this.mainnetProvider.lookupAddress(address);
                        const citizen = new Citizen({
                            address: address,
                            ens: ens,
                            opco: sender,
                            minted: false,
                            delegatedTo: null,
                            votes: {},
                            meta: {},
                        });
                        console.log(citizen);
                        await citizen.save();
                    }

                } catch (error) {
                    console.log({
                        level: 'error',
                        message: `Citizens set: ${sender}, ${citizens}`,
                        error: error,
                    });
                }
            },
        );
    }


}
