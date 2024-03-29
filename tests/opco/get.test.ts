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

describe('GET', () => {
    describe(`/api/${process.env.API_VERSION}/opco/all`, () => {
        it('should get all the opcos', async () => {
            const result = await request(app).get(
                `/api/${process.env.API_VERSION}/opco/all`,
            );
            expect(result.statusCode).toBe(200);
            expect(result.body).toEqual([]);
        });
    });
});