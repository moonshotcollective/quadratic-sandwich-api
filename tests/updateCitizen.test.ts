import { expect } from "chai";
import { app } from "../server";
import { agent as request } from "supertest"; 

describe('POST: /citizen/add', () => {
    it('should add a citizen', async () => {
        const res = await request(app)
            .post('/citizen/update/?address=0x0000000000000000000000000000000000000000')
            .send({
                address: '0x0000000000000000000000000000000000000000',
                ens: '',
                opco: '0x0000000000000000000000000000000000000000',
                minted: false,
                delegatedTo: '0x0000000000000000000000000000000000000000',
                votes: {},
                meta: {},
                onboard: 0,
            });
        expect(res.status).to.eql(201);
        expect(res.body).to.eql({
            address: '0x0000000000000000000000000000000000000000',
            ens: '',
            opco: '0x0000000000000000000000000000000000000000',
            minted: false,
            delegatedTo: '0x0000000000000000000000000000000000000000',
            votes: {},
            meta: {},
            onboard: 0,
        });
    }).timeout(10000);
});