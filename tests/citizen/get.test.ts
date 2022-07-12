// test updating a citizen
import * as dbHandler from '../setup';
import request from 'supertest';
import app from '../../src/api/v1/app';
import { ICitizen } from '../../src/api/v1/interfaces/citizen.i';
import { Citizen } from '../../src/api/v1/models/citizen.model';
import { IEthLoginRequest } from '../../src/api/v1/interfaces/ethLoginRequest.i';

// let token: string;
// Initialize a new citizen
const freshCitizen = (address: string): ICitizen => {
    return new Citizen({
        address: address,
        ens: 'citizen.eth',
        opco: '0x0000000000000000000000000000000000000000',
        minted: false,
        delegatedTo: null,
        votes: {},
        meta: {},
        onboard: 0,
    });
};

beforeAll(async () => {
    await dbHandler.connect();
});

beforeEach(async () => {
    //set timeout for mongoose connection
    // save a fresh citizen to the in-memory db
    const citizen = freshCitizen('0xFe59E676BaB8698c70F01023747f2E27e8A065B9');
    await citizen.save();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(() => {
    return close();
});

const close = async (): Promise<boolean> => {
    await dbHandler.closeDatabase();
    return true;
};

describe('/citizen', () => {
    describe('GET', () => {
        describe(`/api/${process.env.API_VERSION}/citizen/all`, () => {
            it('should get all the citizens', async () => {
                const result = await request(app).get(
                    `/api/${process.env.API_VERSION}/citizen/all`,
                );
                expect(result.statusCode).toBe(200);
                expect(result.body).toBeInstanceOf(Array);
                expect(result.body[0]).toHaveProperty('address');
            });
        });
        describe(`/api/${process.env.API_VERSION}/citizen/`, () => {
            it('should get a single citizen', async () => {
                const result = await request(app).get(
                    `/api/${process.env.API_VERSION}/citizen/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                );
                expect(result.statusCode).toBe(200);
                expect(result.body).toBeInstanceOf(Array);
                expect(result.body[0]).toHaveProperty('address');
            });
        });
    });
});
