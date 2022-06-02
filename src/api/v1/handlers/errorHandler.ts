import { Request, Response, NextFunction } from 'express';

export const unCaughtErrorHandler = (
    err: any, 
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.send({ error: err });
}

export const apiErrorHandler = (
    err: any, 
    req: Request, 
    res: Response,
    message: String,
) => {
    const error: object = { Message: message, Request: req, Stack: err };
    res.json({Message: message });
}