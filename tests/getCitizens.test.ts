// test updating a citizen
import * as dbHandler from './setup';
import request from 'supertest';

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


describe("GET /citizens/all", () => {
  it("All Citizens endpoint", async () => {
    // expect.assertions(2)
    const result = await request(dbHandler.app).get("/citizen/all");
    expect(result.body).toEqual({});
    expect(result.statusCode).toEqual(200);
  });
});