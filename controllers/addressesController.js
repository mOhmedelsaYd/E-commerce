const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc add address to addresses list
// @route POST /api/v1/addresses
// @access Protected/user

// do validation for the product id is in my product or not id for my product (task to do , don't forget)
exports.addAddress = asyncHandler(async (req, res, next) => {
    // $addToSet add address to list addresses if he didn't exists
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    }, { new: true });

    res.status(200).json({status: 'succes', message: 'Addresses added successfully', data: user.addresses })
})

// @desc remove address from addresses list
// @route DELETE /api/v1/addresses/:addressId
// @access Protected/user

exports.removeAddress = asyncHandler(async (req, res, next) => {
    // $pull remove address id from list of addresses if it exists
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } }
    }, { new: true });

    res.status(400).json({status: 'succes', message: 'Address removed successfully', data: user.addresses })
})


// @desc get addresses for logged user
// @route GET /api/v1/addresses
// @access Protected/user


exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    res.status(200).json({status: 'success' , result: user.addresses.length, data: user.addresses})
})
