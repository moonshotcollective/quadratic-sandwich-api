import { providers, Contract, utils, BigNumber } from 'ethers';
import mongoose from 'mongoose';
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
        'event OPCOsAdded(address indexed _op, uint256 indexed _lastCursor, address[] _opcos)', // s?
        'event CitizensAdded(address indexed _opco, uint256 indexed _lastCursor, address[] _citizens)', // s?
        'event CitizenRemoved(address indexed _opco, address indexed _removed)',
        'event Minted(address indexed _minter, address indexed _opco)',
        'event Burned(address _burner)',

        `function getCitizens(uint256 cursor, uint256 count) view public returns (${this.citizenTuple}[] memory, uint256 newCursor)`,
        `function getCitizen(address _adr) public view returns (${this.citizenTuple} memory)`,
        `function getOPCOs(uint256 cursor, uint256 count) view public returns(${this.opcoTuple}[] memory, uint256 newCursor)`,
        `function getOPCO(address _adr) view public returns(${this.opcoTuple} memory)`,
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
            async (
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
                            const opco = await this.badgeContract.getOPCO(adr);
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
                            if (
                                error instanceof mongoose.Error.ValidationError
                            ) {
                                console.log({
                                    level: 'info',
                                    info: 'Add OPCO: OPCO already exists. Updating instead...',
                                });
                                await OPCO.findOneAndUpdate(
                                    { address: parsedContractOPCOs[i].address },
                                    {
                                        citizens:
                                            parsedContractOPCOs[i].citizens,
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
            async (
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
                            const citizen = await this.badgeContract.getCitizen(
                                adr,
                            );
                            return new Citizen({
                                address: adr,
                                ens: '',
                                opco: citizen.opco,
                                minted: false,
                                delegatedTo: null,
                                votes: { test: 1 },
                                meta: { test: 2 },
                            });
                        }),
                    );
                    // Find a better way to skip over errors using batch insertions
                    for (let i = 0; i < parsedContractCitizens.length; i++) {
                        try {
                            await parsedContractCitizens[i].save();
                        } catch (error) {
                            console.log({
                                level: 'error',
                                info: 'Error saving Citizen',
                                error: error,
                            });
                            if (
                                error instanceof mongoose.Error.ValidationError
                            ) {
                                console.log({
                                    level: 'info',
                                    info: 'Add Citizen: Citizen already exists, updating instead...',
                                });
                                await OPCO.findOneAndUpdate(
                                    {
                                        address:
                                            parsedContractCitizens[i].address,
                                    },
                                    {
                                        minted: parsedContractCitizens[i]
                                            .minted, // Update the minted status - IMPROVE ME
                                    },
                                ).exec();
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
            },
        );
    }
}
