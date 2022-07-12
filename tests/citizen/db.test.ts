import { ICitizen } from './../../src/api/v1/interfaces/citizen.i';
import { IOPCO } from './../../src/api/v1/interfaces/opco.i';
import { Citizen } from './../../src/api/v1/models/citizen.model';
import { OPCO } from './../../src/api/v1/models/opco.model';
import * as dbHandler from './../setup';

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

describe('Citizen Database', () => {
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
