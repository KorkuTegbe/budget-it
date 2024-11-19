export default class CustomError extends Error {
    code: number;
    message: string;
    // annotate it with type true
    isOperational: true;
 
    constructor(message: string, code: number, name?: string) {
       super(message);
       Object.setPrototypeOf(this, CustomError.prototype);
       this.code = code;
       this.isOperational = true;
       this.message = message;
       this.name = name || 'error';
    }
}
 
export class BadRequestError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'BadRequestError', 400);
       this.name = 'BadRequestError';
    }
}
 
export class UnAuthorizedError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'UnAuthorized', 401);
       this.name = 'UnAuthorizedError';
    }
}
 
export class ForbiddenError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'UnAuthorized', 403);
       this.name = 'UnAuthorizedError';
    }
}
 
export class ServiceUnavailableError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'Service Unavailable', 503);
       this.name = 'ServiceUnavailableError';
    }
}

export class DuplicateError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'Duplicate Error', 503);
       this.name = 'DuplicateError';
    }
}
 
export class NotFoundError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'NotFoundError', 404);
       this.name = 'NotFoundError';
    }
}

export class InternalServiceError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'Something went wrong', 500);
       this.name = 'InternalServiceError';
    }
}
 