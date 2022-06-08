import { RequestHandler, Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import { IRequestHandlerOptions } from '../interfaces/requestHandlerOptions.i';

const getMessageFromJoiError = (
    error: Joi.ValidationError,
): string | undefined => {
    if (!error.details && error.message) {
        return error.message;
    }
    return error.details && error.details.length > 0 && error.details[0].message
        ? `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}`
        : undefined;
};

export const customRequestHandler =
    (
        handler: RequestHandler,
        options?: IRequestHandlerOptions,
    ): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction) => {
        console.log({
            level: 'info',
            message: `${req.ip} : ${req.method} :: ${req.baseUrl}${req.url}`,
        });
        if (!options?.skipJWTAuth) {
            // verify JWT
        }
        if (options?.validation?.body) {
            const { error } = options?.validation?.body.validate(req.body);
            if (error != null) {
                return next(); // ADD bad request handler
            }
        }
        return handler(req, res, next);
        // .catch((err: Error) => {
        //     console.log({
        //         level: 'error',
        //         message: 'Error in request handler.',
        //         error: err,
        //     });
        //     next(err);
        // });
    };
