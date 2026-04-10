import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err : Error | string,
    req : Request,
    res : Response,
    next: NextFunction
): Response | void {
    if (typeof err === 'string'){
        //Custom application error
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400
        return res.status(statusCode).json({message : err})
    }

    if (err instanceof Error){

        console.error('Error message:', err.message); // message only
        console.error('Stack trace:', err.stack);      // stack trace
        //Standard error object
        return res.status(500).json({message : err.message});
    }

    //Fallback
    console.error(err)
    return res.status(500).json({message : 'Internal server error'});
}

