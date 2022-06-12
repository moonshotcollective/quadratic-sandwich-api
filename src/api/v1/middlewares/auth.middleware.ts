import { Request, Response, NextFunction } from 'express';
import { generateJWT, validateJWT } from '../utils/jwt.utils';
import { verifyEthLoginRequest } from '../utils/verifyEthLogin.utils';

export const authorize = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        console.log('moose');

        // let jwt = req.headers.authorization;
        // console.log("Login")
        // console.log(req.headers.authorization)

        // verify request has token
        // if (!jwt) {
        //     return res.status(401).json({ message: 'Invalid token ' });
        // }
        // // // remove Bearer if using Bearer Authorization mechanism
        // if (jwt.toLowerCase().startsWith('bearer')) {
        //     jwt = jwt.slice('bearer'.length).trim();
        // }
        // // console.log(jwt)
        // // // verify token hasn't expired yet
        // const decodedToken = await validateJWT(jwt);
        // console.log(decodedToken)

        next();
        return res.status(200);
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Expired token' });
            return;
        }
        res.status(500).json({ message: 'Failed to authenticate user' });
    }
};

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const loginRequest: IEthLoginRequest = req.body;
        if (verifyEthLoginRequest(loginRequest)) {
            console.log({
                level: 'info',
                message: `Login Request: ${loginRequest.address}`,
            });
            // Generate the token and send it back to the client
            const token = await generateJWT(loginRequest);
            res.status(200).json(token);
        } else {
            res.status(401).json({"Error": "Invalid token request."});
        }
        return;
    } catch (error) {
        console.log(error)
        res.status(401).json({"Error": "Invalid token validation."})
        return; 
    }
};
