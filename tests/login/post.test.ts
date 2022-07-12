// test updating a citizen
import * as dbHandler from './../setup';
import request from 'supertest';
import app from './../../src/api/v1/app';

beforeAll(async () => {
    await dbHandler.connect();
});

beforeEach(async () => {
    //set timeout for mongoose connection
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

describe('/login', () => {
    describe('POST', () => {
        it('should login with address and signature', async () => {
            const result = await request(app)
                .post(`/api/${process.env.API_VERSION}/login`)
                .send({
                    address: '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    signature:
                        '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                });
            expect(result.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
            expect(result.statusCode).toBe(200);
            // expect the response to regex match a jwt
            expect(result.body).toMatch(
                /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/,
            );
        });
        it('should fail to login with address and missing signature', async () => {
            const result = await request(app)
                .post(`/api/${process.env.API_VERSION}/login`)
                .send({
                    address: '0xFe59E676BaB8698c70F01023747f2E27e8A065B9',
                    signature: '',
                });
            expect(result.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
            expect(result.statusCode).toBe(401);
        });
        it('should fail to login with missing address and missing signature', async () => {
            const result = await request(app)
                .post(`/api/${process.env.API_VERSION}/login`)
                .send({
                    address: '',
                    signature: '',
                });
            expect(result.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
            expect(result.statusCode).toBe(401);
        });

        it('should fail to login with signature and missing address', async () => {
            const result = await request(app)
                .post(`/api/${process.env.API_VERSION}/login`)
                .send({
                    address: '',
                    signature:
                        '0x7b9e0919ab52db03110c223f6ab43edd6fc8998a94c53f4b4250675cc58e97882326e06a354796547e5734d6d3382576f72d0c8c18405417ce79a1e69327328f1b',
                });
            expect(result.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
            expect(result.statusCode).toBe(401);
        });
    });

});