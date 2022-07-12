import { ICitizen } from '../src/api/v1/interfaces/citizen.i';
import { IOPCO } from '../src/api/v1/interfaces/opco.i';
import { Citizen } from '../src/api/v1/models/citizen.model';
import { OPCO } from '../src/api/v1/models/opco.model';
import * as dbHandler from './setup';

beforeAll(async () => {
    await dbHandler.connect();
});

beforeEach(async () => {
    //set timeout for mongoose connection
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
    await dbHandler.closeConnection();
});

describe('Save to Database', () => {
    describe('Citizens', () => {
        it('should save citizen', async () => {
            expect.assertions(6);
            const citizen: ICitizen = new Citizen({
                address: '0x0000000000000000000000000000000000000000',
                ens: 'test.eth',
                opco: '0x0000000000000000000000000000000000000000',
                minted: false,
                delegatedTo: '0x0000000000000000000000000000000000000000',
                votes: {},
                meta: {},
                onboard: 0,
            });
            await citizen.save();
            // find inserted citizen
            const foundCitizen = await Citizen.findOne({
                address: citizen.address,
            }).exec();
            expect(foundCitizen?.address).toEqual(citizen.address);
            expect(foundCitizen?.ens).toEqual(citizen.ens);
            expect(foundCitizen?.opco).toEqual(citizen.opco);
            expect(foundCitizen?.minted).toEqual(citizen.minted);
            expect(foundCitizen?.delegatedTo).toEqual(citizen.delegatedTo);
            expect(foundCitizen?.onboard).toEqual(citizen.onboard);
        });

        it('should fail to save a duplicated address citizen', async () => {
            const citizen: ICitizen = new Citizen({
                address: '0x0000000000000000000000000000000000000000',
                ens: 'test.eth',
                opco: '0x0000000000000000000000000000000000000000',
                minted: false,
                delegatedTo: '0x0000000000000000000000000000000000000000',
                votes: {},
                meta: {},
                onboard: 0,
            });
            const dupCitizen: ICitizen = new Citizen({
                address: '0x0000000000000000000000000000000000000000',
                ens: 'nottest!.eth',
                opco: '0x999999999999999999999999999999999999999',
                minted: true,
                delegatedTo: '0x0000000000000000000000000000000000000000',
                votes: {},
                meta: {},
                onboard: 0,
            });
            await citizen.save();
            const saveDup = async () => {
                await dupCitizen.save();
            };
            await expect(saveDup()).rejects.toThrow();
        });
    });

    describe('OPCOs', () => {
        it('should save an OPCO', async () => {
            expect.assertions(7);
            const opco: IOPCO = new OPCO({
                address: '0x0000000000000000000000000000000000000000',
                ens: 'test.eth',
                citizens: [],
                supply: 999,
                allocated: 999,
                minted: 999,
                onboard: 0,
                meta: {},
            });
            await opco.save();
            // find inserted opco
            const foundOpco = await OPCO.findOne({
                address: opco.address,
            }).exec();
            expect(foundOpco?.address).toEqual(opco.address);
            expect(foundOpco?.ens).toEqual(opco.ens);
            expect(foundOpco?.citizens).toEqual(opco.citizens);
            expect(foundOpco?.supply).toEqual(opco.supply);
            expect(foundOpco?.allocated).toEqual(opco.allocated);
            expect(foundOpco?.minted).toEqual(opco.minted);
            expect(foundOpco?.onboard).toEqual(opco.onboard);
        });
    });

    describe('POST: /opco/add/:address', () => {
        it('should not save a duplicate OPCO', async () => {
            const opco: IOPCO = new OPCO({
                address: '0x0000000000000000000000000000000000000000',
                ens: 'test.eth',
                citizens: [],
                supply: 999,
                allocated: 999,
                minted: 999,
                onboard: 0,
                meta: {},
            });

            const dupOPCO: IOPCO = new OPCO({
                address: '0x0000000000000000000000000000000000000000',
                ens: 'nottest!.eth',
                citizens: [],
                supply: 666,
                allocated: 666,
                minted: 666,
                onboard: 0,
                meta: {},
            });
            await opco.save();
            const saveDup = async () => {
                await dupOPCO.save();
            };
            await expect(saveDup()).rejects.toThrow();
        });
    });
});
