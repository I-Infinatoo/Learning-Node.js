const AppError = require('./../utils/appError');

const handleCasteErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value`;

    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input Data. ${errors.join('. ')}`;

    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const handleJWTError = err => new AppError('Invalid tolen! Please login again', 401);
const handleJWTExpiredToken = err => new AppError('Your token has expired! Please login again', 401);

const sendErrorProd = (err, res) => {

    //Operational Trusted error: send message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        //Programming or unknown error: don't laek error details

        // 1. log error
        console.error('ERROR', err);

        // 2, send generic msg
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!!'
        });
    }
}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    /* 500 for internal server error
     *
     *  provide the err with the status code if provided by the above handlers or else 500
    **/

    err.status = err.status || 'error';


    if (process.env.NODE_ENV == 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV == 'production') {

        // let error = { ...err }; //destructuring the error


        // error handling for the mongoos
        let error = Object.assign(err);

        if (error.name === 'CastError') error = handleCasteErrorDB(error);
        if (error.name === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredToken(error);

        sendErrorProd(error, res);

        // sendErrorProd(err, res);

    }


} 