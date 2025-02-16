const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middleware/uploadimageMiddleware');
const factory = require('./handlerFactory');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/createToken');
const { moveMessagePortToContext } = require('node:worker_threads');

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// image processing
exports.resizeImage = asyncHandler(async(req, res, next) => { // if we refactor we make multi arguments for this we don't refactoring this
    
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
    if (req.file) {
        await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/users/${filename}`);
        req.body.profileImage = filename;
    }  
    next();
})


// @desc get list of all users
// @route GET /api/v1/user
// @access Private/admin

exports.getUsers = factory.getAll(User);

// @desc Get specific user by id
// @route GET /api/v1/user/:id
// @access Private/admin

exports.getUser = factory.getOne(User);

// then() catch()
// try{} catch{}
// asyncHandler => express error handler (you should take error from express and customize them)


// @desc Create user
// @route POST /api/v1/user
// @access Private/admin

exports.createUser = factory.createOne(User);
    // try {
    // }
    // catch(err) {
    //     res.status(400).json({ error: err.message });
    // }
// search about asyncHandler  for another solution

/* const name = req.body.name;


CategoryModel.create({ name, slug: slugify(name) })
    .then(category => {
    res.status(201).json({ data: category });
    })
    .catch(err => {
    res.status(400).json({ error: err.message });
    }); */


// @desc Update specific user
// @route PUT /api/v1/user/:id
// @access Private/admin

exports.updateUser =    asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        slug: req.body.slug,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        role: req.body.role
    }, { new: true });

    if (!document) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
})


exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now()
    }, { new: true });

    if (!document) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
})

// @desc Delete specific user
// @route DELETE /api/v1/user/:id
// @access Private/admin

exports.deleteUser = factory.deleteOne(User);

// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//     const id = req.params.id;
//     const brand = await brandModel.findOneAndDelete({ _id: id });

//     if (!brand) {
//         // res.status(404).json({ msg: `No category for this id ${id}` });
//         return next(new ApiError(`No brand for this id ${id}`, 404));
//     }

//     res.status(204).json();
// })


// @desc get logged user data
// @route GET /api/v1/user/getMe
// @access Private/protect

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

// @desc update logged user password
// @route PUT /api/v1/user/changePassword
// @access Private/protect


exports.updateLoaggedPassword = asyncHandler(async (req, res, next) => { 
    // get user and update password
    const user = await User.findByIdAndUpdate(req.user._id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now()
    }, { new: true });

    // generate new token
    const token = generateToken(user._id);

    res.status(200).json({ data: user, token });
})

// @desc update logged user data(without password or role)
// @route PUT /api/v1/user/changeMe
// @access Private/protect

exports.updateLoggedData = asyncHandler(async(req, res, next) => {
    const updateUser = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }, { new: true });
    
    res.status(200).json({ data: updateUser });

})


// @desc   DELETE Decative user (without password or role)
// @route DELETE /api/v1/user/decativeMe
// @access Private/protect

exports.deactiveUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        active: false
    }, { new: true });
    
    res.status(204).json({status: 'success'});
})