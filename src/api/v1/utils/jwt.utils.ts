import { sign, SignOptions, verify, VerifyOptions, Secret } from 'jsonwebtoken';
import { getRole } from '../helpers/role.helper';
import { ITokenPayload } from '../interfaces/jwt.i';

export const generateJWT = async (loginRequest: IEthLoginRequest) => {
    // Fallback to PUBLIC role if fails
    const role = loginRequest ? await getRole(loginRequest.address) : 'PUBLIC'
    const payload = {
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

export const validateJWT = (token: string): Promise<ITokenPayload> => {
    const privateKey: Secret = process.env.SIGNATURE_SECRET
        ? process.env.SIGNATURE_SECRET
        : 'SECRET';

    const verifyOptions: VerifyOptions = {
        algorithms: ['HS256'],
    };

    return new Promise((resolve, reject) => {
        "poop"
        // return verify(token, privateKey, verifyOptions);
      });
};
