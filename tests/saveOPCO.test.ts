import { IOPCO } from '../src/api/v1/interfaces/opco.i';
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

describe('POST: /opco/add/:address', () => {
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
        const foundOpco = await OPCO.findOne({ address: opco.address }).exec();
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
