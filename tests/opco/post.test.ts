// test updating a citizen
import * as dbHandler from '../setup';
import request from 'supertest';
import app from '../../src/api/v1/app';
import { ICitizen } from '../../src/api/v1/interfaces/citizen.i';
import { Citizen } from '../../src/api/v1/models/citizen.model';
import { IEthLoginRequest } from '../../src/api/v1/interfaces/ethLoginRequest.i';
import { IOPCO } from '../../src/api/v1/interfaces/opco.i';
import { OPCO } from '../../src/api/v1/models/opco.model';

// let token: string;
// Initialize a new citizen
const freshOPCO = (address: string): IOPCO => {
    return new OPCO({
        address: address,
        ens: 'opco.eth',
        citizens: [],
        supply: 2,
        allocated: 0,
        minted: 0,
        onboard: 0,
        meta: {},
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
    const opco = freshOPCO('0xFe59E676BaB8698c70F01023747f2E27e8A065B9');
    await opco.save();
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

describe('/opco', () => {
    describe('POST', () => {
        // test updating a citizen
        describe(`/api/${process.env.API_VERSION}/opco/update`, () => {
            it('should update opco `onboard` status', async () => {
                const token = await getJWT(
                    '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                    'OPCO_ROLE',
                );
                const result = await request(app)
                    .post(
                        `/api/${process.env.API_VERSION}/opco/update/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ onboard: 666 });

                expect(result.statusCode).toEqual(200);

                const citizenRes = await request(app).get(
                    `/api/${process.env.API_VERSION}/opco/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                );
                expect(citizenRes.body[0]).toEqual(result.body);
            });

            it('should update opco `meta`', async () => {
                const token = await getJWT(
                    '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                    'OPCO_ROLE',
                );

                const testMeta = {
                    meta: {
                        name: 'John Doe Project',
                        description: 'This is a project for John Doe',
                        website: 'https://john.doe.project',
                        github: 'https://github.com',
                        twitter: 'https://twitter.com',
                        profileImg: '',
                        headerImg: '',
                    },
                };
                // update the citizen meta
                const result = await request(app)
                    .post(
                        `/api/${process.env.API_VERSION}/opco/update/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send(testMeta);

                expect(result.statusCode).toEqual(200);

                const citizenRes = await request(app).get(
                    `/api/${process.env.API_VERSION}/opco/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                );
                expect(citizenRes.body[0].meta).toEqual(testMeta.meta);
            });

            it('should fail to update opco if the address is not provided', async () => {
                const token = await getJWT(
                    '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                    'OPCO_ROLE',
                );
                const result = await request(app)
                    .post(
                        `/api/${process.env.API_VERSION}/opco/update/?address=`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ onboard: 666 });

                expect(result.statusCode).toEqual(400);
            });

            it('should fail to update blocked object elements', async () => {
                const token = await getJWT(
                    '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                    'OPCO_ROLE',
                );
                const result = await request(app)
                    .post(
                        `/api/${process.env.API_VERSION}/opco/update/?address=0xFe59E676BaB8698c70F01023747f2E27e8A065B9`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        // address: '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                        // ens: 'opco.eth',
                        // citizens: [],
                        // supply: 2,
                        // allocated: 0,
                        minted: 0,
                        onboard: 0,
                        meta: {},
                    });

                expect(result.statusCode).toEqual(404);
            });
        });
    });
});
