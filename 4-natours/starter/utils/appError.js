class AppError extends Error {

    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.endsWith('4') ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
        // to exclude the error from maitaining the stack-trace
    }
}

module.exports = AppError;