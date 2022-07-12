// mock db setup
import * as dotenv from 'dotenv';
const env = dotenv.config();
if (env.error) {
    dotenv.config({ path: '.env' });
}
import mongoose, {  } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoConnection from '../src/api/v1/config/db.config';
import app from '../src/api/v1/app';
import { getRole } from '../src/api/v1/helpers/role.helper';
import { IEthLoginRequest } from '../src/api/v1/interfaces/ethLoginRequest.i';
import { ITokenPayload } from '../src/api/v1/interfaces/tokenPayload.i';
import { sign, SignOptions, verify, VerifyOptions, Secret } from 'jsonwebtoken';


/**
 * Connect to mock memory db.
 */
export const citizenHouseApp = app;
let mongod: MongoMemoryServer;
let configuredDb: MongoConnection;
let dbConn: mongoose.Connection;
let serverConn: any;

export const connect = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    configuredDb = new MongoConnection(uri);
    dbConn = await configuredDb.connect(() => {}); 
}

export const closeConnection = async () => {
    // await serverConn.close();

}

/**
 * Close db connection
 */
export const closeDatabase = async () => {
    await dbConn.dropDatabase();
    await dbConn.close();
    await configuredDb.close(() => {console.log('db closed')});
}

/**
 * Delete db collections
 */
export const clearDatabase = async () => {
    const collections = dbConn.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

export const generateFakeJWT = async (loginRequest: IEthLoginRequest, role: string) => {
    // Fallback to PUBLIC role if fails
    console.log(await getRole(loginRequest.address));

    const payload: ITokenPayload = {
        address: loginRequest.address,
        signature: loginRequest.signature,
        role: role,
    };

    const privateKey: Secret = process.env.SIGNATURE_SECRET
        ? process.env.SIGNATURE_SECRET
        : 'SECRET';

    const signInOptions: SignOptions = {
        algorithm: 'HS256',
        expiresIn: '1h',
    };

    return sign(payload, privateKey, signInOptions);
};
