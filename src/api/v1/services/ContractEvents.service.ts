import { providers, Contract, utils, BigNumber } from 'ethers';
import { ICitizen } from '../interfaces/citizen.i';
import { Citizen } from '../models/citizen.model';

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

    private badeContract2 = this.provider.getCode(this.badgeAddress);

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
        console.log(await this.badeContract2);
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

                    const opcos = await this.badgeContract.getOPCOs(
                        BigNumber.from(
                            _lastCursor - 1 >= 0 ? _lastCursor - 1 : 0,
                        ),
                        BigNumber.from(_lastCursor),
                    );
                    // const {0: opCoAddresses}
                    console.log(opcos);
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
                            votes: {"test": 1},
                            meta: {"test": 2},
                        });
                    });

                    Citizen.insertMany(parsedCitizens).catch(error => {
                        // TODO: Check if error is MongoBulkWriteError: E11000 duplicate key error
                        // And update all other mutable fields
                        Citizen.updateMany({address: error.errors.address.value}, {ens: "HA"}, () => {})
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
