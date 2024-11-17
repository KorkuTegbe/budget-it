import { NextFunction, Request, Response } from "express";

export function AppErrorHandler( err: Error, req: Request, res: Response, next: NextFunction ) {
    if (process.env.NODE_ENV === 'development') {
        return handleDevelopmentError(err, res);
    };

    return handleProductionError(err, res)
}

function handleProductionError(err: any, res: Response): Response{
    const { ...error } = err;
    console.log(error, err, error.isOperational);
    const openApiPattern = /openapi\.validation/;

    if (err.name === 'CastError') {
        return CastError(error, res)
    }

    if (error.code === 11000) {
        return DuplicateError(error, res)
    }

    if (err.name === 'JsonWebTokenError') {
        return JWTMalformError(error, res)
    }

    if (err.name === 'ValidationError') {
        return ValidationError(error, res)
    }

    if (error.name === 'TokenExpireError') {
        return TokenExpireError(error, res);
    }

    if (error.isOperational) {
        return __response(err, res, err.code, err.message);
    }

    /**oops  */
    if (error.type === 'entity.parse.failed' && error.expose) {
        return __response(err, res, 400, 'invalid entity in request body');
    }

    if (openApiPattern.test(err?.errors[0]?.errorCode)) {
        return handleOpenAPIValidation(error, res);
    }

    return res.status(500).json({
        success: false,
        errors: 'INTERNAL_SERVER_ERROR',
        message: 'There was a glitch processing your request. Kindly try again'
    })

}

function __response(err: Error, res: Response, code: number, message: string ): Response {
    return res.status(code || 400).json({
        success: false,
        // status: code,
        errors: err.name || 'error',
        message
    });
}

function handleOpenAPIValidation(err: any, res: Response): Response {
    let message = '';
    err.errors.forEach((error: any) => {
       message += `path ${error.path}: ${error.message}, `;
    });
    return res.status(err.statusCode || 400).json({
       success: false,
       // status: err.status,
       errors: err.errors,
       message
    });
}
 
function DuplicateError(err: any, res: Response): Response {
    err.name = 'DuplicateError';
    const message = `${Object.entries(err.keyValue)} is taken, try another value`;
    return __response(err, res, 409, message);
}
 
 
function ValidationError(err: any, res: Response): Response {
    err.name = 'ValidationError';
    const message = `validation failed ${Object.values(err.errors).map(
       (_: any) => _.message
    )}`;
    return __response(err, res, 400, message);
}
 
function CastError(err: any, res: Response): Response {
    err.name = 'InvalidIdError';
    const message = `Invalid ${err.path}: ${err.value}`;
    return __response(err, res, 400, message);
}
 
function JWTMalformError(err: any, res: Response): Response {
    err.name = 'SessionError';
    const message = `There seems to be an error with your login information. Please double check that your credentials are correct and try again.`;
    return __response(err, res, 400, message);
}
 
function TokenExpireError(err: any, res: Response): Response {
    const message = `Your session has expired. log in again and try again.`;
    return __response(err, res, 400, message);
}
 
function handleDevelopmentError(err: any, res: Response): Response {
    return res.status(400).json({
       success: false,
       // status: err.code || 400,
       errors: err.name,
       message: err.message,
       stack: err.stack
    });
}
 