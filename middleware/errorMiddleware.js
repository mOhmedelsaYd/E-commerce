const ApiError = require('../utils/ApiError');
const handleJwtInvalidSignature = () => new ApiError('Invalid Token, Please login again ....', 401);
const handleJwtEpire = () => new ApiError('Expire Token, Please login again ....', 401);

const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}


const sendErrorForProd = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    } else {
        if (err.name == 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if (err.name == 'TokenExpiredError') err = handleJwtEpire();
        sendErrorForProd(err, res);
    }
};



module.exports = globalError;