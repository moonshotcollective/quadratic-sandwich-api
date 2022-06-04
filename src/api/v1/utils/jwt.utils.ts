import { sign, SignOptions, verify, VerifyOptions, Secret } from 'jsonwebtoken';
import { ITokenPayload } from '../interfaces/jwt.interface';

export const generateJWT = () => {
    const payload = {
        test: 'Test',
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
        verify(token, privateKey, verifyOptions);
      });
};
