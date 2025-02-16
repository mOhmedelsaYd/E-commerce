const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs/dist/bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/createToken');
    
// @desc signUp
// @route PUT /api/v1/auth/signUp
// @access Public

exports.signUp = asyncHandler(async (req, res, next) => {
    // 1-create user

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // 2-generate token
    const token = generateToken(user._id);

    res.status(201).json({data: user, token})
})

// @desc login
// @route PUT /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
    //1- check email and password is correct (validation)
    //2- check if user exists and password is correct
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('email or password not correct', 401))
    }
    //3- generate token
    const token = generateToken(user._id);
    //4- send response
    res.status(200).json({data: user, token})
})


exports.protect = asyncHandler(async (req, res, next) => {
    //1- check token exists if exists get it
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        // throw new ApiError('You are not login, Please login to get access this route') or
        return next(new ApiError('You are not login, Please login to get access this route', 401))
    }
    //2- verify token (no changes in payload, not expire)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //3- check user exists
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
        return next(new ApiError('the user that belong to this token no longer exist', 401))
    }

    //4- check user if change his password after token created 
    if (currentUser.passwordChangedAt) {
        const passChangeTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        console.log(passChangeTimeStamp, decoded.iat)
        if (passChangeTimeStamp > decoded.iat) { // password changed after token iat 
            return next(new ApiError('User recently changed his password, please login again', 401))
        }
    }


    req.user = currentUser;
    next()
})


exports.allowedTo = (...roles) => 
    asyncHandler(async (req, res, next) => {
        //1- check user role
        if (!(roles.includes(req.user.role)))
            return next(new ApiError('You have no permission to perform this action', 403));

        next();
    })

// @desc forget password
// @route POST /api/v1/auth/forgetPassword
// @access Public

exports.forgetPasswod = asyncHandler(async (req, res, next) => {
    // 1- get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user for this email ${req.body.email}`, 404))
    }
    // 2- check if user exists, generate reset random 6 number, save it in our db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hasedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    //saved hased reset code in db 
    user.passwordResetCode = hasedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    user.passwordResetVerified = false // not verified yet

    await user.save();

    // 3- send the reset code via email
    
    
    const message = `Hi ${user.name},\nWe received a request to reset the password on your E-shop Account. \n${resetCode} \nEnter this code to complete the reset. \nThanks for helping us keep your account secure.\nThe E-shop Team`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min)',
            message,
        });
    } catch (err) {
        user.passwordResetCode = undefined
        user.passwordResetExpires = undefined
        user.passwordResetVerified = undefined
        await user.save();

        return next(new ApiError('Email could not be sent', 500))
    }

    res.status(200).json({status: 'Success', message: 'Reset code sent to email'})
})


// @desc verify reset password
// @route POST /api/v1/auth/verifyResetCode
// @access Public

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    // 1) get user based on  reset code
    const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

    const user = await User.findOne({ passwordResetCode: hashedResetCode, passwordResetExpires: {$gt: Date.now()} });

    if (!user) {
        return next(new ApiError(`Invalid reset code or expired`, 400))
    }

    // 2) Reset code valid
    user.passwordResetVerified = true

    await user.save();

    res.status(200).json({status: 'Success', message: 'Reset code verified'})
})

// @desc reset password
// @route PUT /api/v1/auth/resetPassword
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1) get user based on email

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`there is no user with this email`, 404))
    }
    // check if reset code verified
    if (!user.passwordResetVerified) {
        return next(new ApiError(`password reset code has not been verified`, 400))
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    // 3) if everything is ok, generate token
    const token = generateToken(user._id);

    res.status(200).json({ data: user, token });
})