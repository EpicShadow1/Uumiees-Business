import { Request, Response, NextFunction } from 'express';

export const timeoutConfig = {
    //Request timeouts
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'), // 30s
    databaseTimeout: parseInt(process.env.DB_TIMEOUT || '5000'),     // 5s
    externalApiTimeout: parseInt(process.env.EXTERNAL_API_TIMEOUT || '10000'), // 10s

    //Connection timeouts
    connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT || '2000'), // 2s
};

export const timeoutMiddleware = (ms: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const timeout = setTimeout(() => {
            res.status(504).json({ error: 'Request timeout' });
        }, ms);

        res.on('finish', () => clearTimeout(timeout));
        next();
    };
};
