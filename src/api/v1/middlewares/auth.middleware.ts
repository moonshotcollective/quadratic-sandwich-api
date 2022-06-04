import { Request, Response, NextFunction } from 'express';
import { validateJWT } from '../utils/jwt.utils';

export const authorize =
    () => async (req: Request, res: Response, next: NextFunction) => {
        try {
            // let jwt = req.headers.authorization;
            console.log("Login")
            console.log(req.body)

            // verify request has token
            // if (!jwt) {
            //     return res.status(401).json({ message: 'Invalid token ' });
            // }
            // // remove Bearer if using Bearer Authorization mechanism
            // if (jwt.toLowerCase().startsWith('bearer')) {
            //     jwt = jwt.slice('bearer'.length).trim();
            // }
            // console.log(jwt)
            // // verify token hasn't expired yet
            // const decodedToken = await validateJWT(jwt);
            // console.log(decodedToken)

            next();

        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Expired token' });
                return;
            }
            res.status(500).json({ message: 'Failed to authenticate user' });
        }
    };
