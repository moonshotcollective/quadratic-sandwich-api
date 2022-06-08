import Joi from '@hapi/joi';

export interface IRequestHandlerOptions {
    validation?: {
        body?: Joi.ObjectSchema;
    };
    skipJWTAuth?: boolean;
}

