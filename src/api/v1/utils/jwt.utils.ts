import { sign, SignOptions, verify, VerifyOptions, Secret } from 'jsonwebtoken';
import { getRole } from '../helpers/role.helper';
import { IEthLoginRequest } from '../interfaces/ethLoginRequest.i';
import { ITokenPayload } from '../interfaces/tokenPayload.i';

export const generateJWT = async (loginRequest: IEthLoginRequest) => {
    // Fallback to PUBLIC role if fails
    console.log(await getRole(loginRequest.address));
    const role = loginRequest ? await getRole(loginRequest.address) : 'PUBLIC';

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

// TODO: Explore async options here
export function validateJWT(token: string): any {
    try {
        const privateKey: Secret = process.env.SIGNATURE_SECRET
            ? process.env.SIGNATURE_SECRET
            : 'SECRET';

        const verifyOptions: VerifyOptions = {
            algorithms: ['HS256'],
        };
        if (token.toLowerCase().startsWith('bearer')) {
            token = token.slice('bearer'.length).trim();
        }

        return verify(token, privateKey, verifyOptions);
    } catch (error) {
        console.log(error);
        // return token;
        return {};
    }
}
