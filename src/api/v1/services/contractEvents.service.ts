import { providers, Contract, utils, BigNumber } from 'ethers';
import { ICitizen } from '../interfaces/citizen.i';
import { IOPCO } from '../interfaces/opco.i';
import { Citizen } from '../models/citizen.model';
import { OPCO } from '../models/opco.model';

export default class ContractEventService {
    private provider = new providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
    private mainnetProvider = new providers.JsonRpcProvider(
        process.env.MAINNET_RPC_ENDPOINT,
    );
    private badgeAddress = process.env.CONTRACT_ADDRESS
        ? process.env.CONTRACT_ADDRESS
        : '0'; // Fallback ?
    private opcoTuple =
        '(address co, address[] citizens, uint256 supply, uint256 minted)';
    private citizenTuple =
        '(address citizen, address opco, bool minted, address delegate, uint256 delegations)';
    private badgeAbi = [
        'event OPsAdded(address indexed _sender)',
        'event OPCOsAdded(address indexed _op, uint256 indexed _lastCursor)',
        'event CitizensAdded(address indexed _opco, uint256 indexed _lastCursor)',
        'event CitizenRemoved(address indexed _opco, address indexed _removed)',
        'event Minted(address indexed _minter, address indexed _opco)',
        'event Burned(address _burner)',

        `function getCitizens(uint256 cursor, uint256 count) view public returns (${this.citizenTuple}[] memory, uint256 newCursor)`,
        `function getOPCOs(uint256 cursor, uint256 count) view public returns(${this.opcoTuple}[] memory, uint256 newCursor)`,
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

    async initializeContractEventService() {
        this.addCitizensEventHandler();
        this.addOPCOsEventHandler();
    }

    private addOPCOsEventHandler() {
        this.badgeContract.on(
            'OPCOsAdded',
            async (_op: string, _lastCursor: number): Promise<void> => {
                try {
                    console.log({
                        level: 'info',
                        message: `OPCo's Added: ${_op}, Last Index: ${_lastCursor}`,
                    });

                    const [opcos, cursor] = await this.badgeContract.getOPCOs(
                        BigNumber.from(0),
                        BigNumber.from(_lastCursor),
                    );

                    const parsedOPCOs = opcos.map((d: any): IOPCO => {
                        return new OPCO({
                            address: d.co,
                            ens: '',
                            citizens: d.citizens,
                            supply: d.supply.toNumber(),
                            minted: d.minted.toNumber(),
                            onboard: 0,
                            meta: {
                                name: 'test1',
                                description: 'testdescription',
                                profileImg: 'img',
                                headerImg: 'img',
                            },
                        });
                    });

                    OPCO.insertMany(parsedOPCOs).catch((error: any) => {
                        // TODO: Check if error is MongoBulkWriteError: E11000 duplicate key error
                        // And update all other mutable fields
                        OPCO.updateMany(
                            { address: error.errors.address.value },
                            { ens: 'nulleth.eth' },
                            () => {},
                        );
                    });
                } catch (error) {
                    console.log(error);
                }
            },
        );
    }
    /** Enable the SetCitizen Event Handler.
     *  This listens for the SetCitizens Contract emission which then retrivies
     *  the OpCo citizen list and applies it to the database.
     */
    private addCitizensEventHandler() {
        this.badgeContract.on(
            'CitizensAdded',
            async (_opco: string, _lastCursor: number): Promise<void> => {
                try {
                    console.log({
                        level: 'info',
                        message: `Citizens set: ${_opco}`,
                    });

                    const [citizens, cursor] =
                        await this.badgeContract.getCitizens(
                            BigNumber.from(0),
                            BigNumber.from(_lastCursor),
                        );

                    const parsedCitizens = citizens.map((d: any): ICitizen => {
                        return new Citizen({
                            address: d.citizen,
                            ens: '',
                            opco: d.opco,
                            minted: false,
                            delegatedTo: null,
                            votes: { test: 1 },
                            meta: { test: 2 },
                        });
                    });

                    Citizen.insertMany(parsedCitizens).catch((error: any) => {
                        // TODO: Check if error is MongoBulkWriteError: E11000 duplicate key error
                        // And update all other mutable fields
                        Citizen.updateMany(
                            { address: error.errors.address.value },
                            { ens: 'HA' },
                            () => {},
                        );
                    });
                } catch (error) {
                    console.log({
                        level: 'error',
                        message: `Citizens set: ${_opco}`,
                        error: error,
                    });
                }
            },
        );
    }
}
