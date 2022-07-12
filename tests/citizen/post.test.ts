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

const getJWT = async (
    address: string,
    signature: string,
    role: string,
): Promise<any> => {
    const login: IEthLoginRequest = {
        address: address,
        signature: signature,
    };
    return dbHandler.generateFakeJWT(login, role);
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
    describe('POST', () => {
        // test updating a citizen
        describe(`/api/${process.env.API_VERSION}/citizen/update`, () => {
            it('should update citizen `onboard` status', async () => {
                const token = await getJWT(
                    '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                    'CITIZEN_ROLE',
                );
                const result = await request(app)
                    .post(
                        `/api/${process.env.API_VERSION}/citizen/update/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ onboard: 666 });

                expect(result.statusCode).toEqual(200);

                const citizenRes = await request(app).get(
                    `/api/${process.env.API_VERSION}/citizen/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                );
                expect(citizenRes.body[0]).toEqual(result.body);
            });

            it('should update citizen `meta`', async () => {
                const token = await getJWT(
                    '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                    'CITIZEN_ROLE',
                );

                const testMeta = {
                    meta: {
                        name: 'John Doe Project',
                        description: 'This is a project for John Doe',
                        website: 'https://john.doe.project',
                        github: 'https://github.com',
                        twitter: 'https://twitter.com',
                    },
                };
                // update the citizen meta
                const result = await request(app)
                    .post(
                        `/api/${process.env.API_VERSION}/citizen/update/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send(testMeta);

                expect(result.statusCode).toEqual(200);

                const citizenRes = await request(app).get(
                    `/api/${process.env.API_VERSION}/citizen/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                );
                expect(citizenRes.body[0].meta).toEqual(testMeta.meta);
            });
        });
    });
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
