import { sign, SignOptions, verify, VerifyOptions, Secret } from 'jsonwebtoken';
import { getRole } from '../helpers/role.helper';
import { IEthLoginRequest } from '../interfaces/ethLoginRequest.i';
import { ITokenPayload } from '../interfaces/tokenPayload.i';

export const generateJWT = async (loginRequest: IEthLoginRequest) => {
    // Fallback to PUBLIC role if fails
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

// export const validateJWT = (token: string): Promise<ITokenPayload> => {
//     const privateKey: Secret = process.env.SIGNATURE_SECRET
//         ? process.env.SIGNATURE_SECRET
//         : 'SECRET';

//     const verifyOptions: VerifyOptions = {
//         algorithms: ['HS256'],
//     };
//     if (token.toLowerCase().startsWith('bearer')) {
//         token = token.slice('bearer'.length).trim();
//     }
//     return await verify(token, privateKey, verifyOptions);
//     // new Promise((resolve, reject) => {
//     //     return verify(token, privateKey, verifyOptions);
//     // });
// };
export function validateJWT(token: string): Promise<ITokenPayload> {
    // const publicKey = fs.readFileSync(path.join(__dirname, './../../../public.key'));

    // const verifyOptions: VerifyOptions = {
    //   algorithms: ['RS256'],
    // };

    const privateKey: Secret = process.env.SIGNATURE_SECRET
        ? process.env.SIGNATURE_SECRET
        : 'SECRET';

    const verifyOptions: VerifyOptions = {
        algorithms: ['HS256'],
    };
    if (token.toLowerCase().startsWith('bearer')) {
        token = token.slice('bearer'.length).trim();
    }

    return new Promise((resolve, reject) => {
        verify(
            token,
            privateKey,
            verifyOptions,
            (error: any, decoded: any) => {
                if (error) return reject(error);
                resolve(decoded);
            }
        );
    });
}
