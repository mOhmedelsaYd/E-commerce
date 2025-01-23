const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');


// @desc add product to wishlist
// @route POST /api/v1/wishlist
// @access Protected/user

// do validation for the product id is in my product or not id for my product (task to do , don't forget)
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    // $addToSet add product id to list if he didn't exists
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId }
    }, { new: true });

    res.status(200).json({status: 'succes', message: 'Product added successfuly to your wishlist', data: user.wishlist })
})

// @desc remove product from wishlist
// @route DELETE /api/v1/wishlist/:id
// @access Protected/user

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    // $pull remove product id from list if it exists
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId }
    }, { new: true });

    res.status(400).json({status: 'succes', message: 'Product removed successfuly from your wishlist', data: user.wishlist })
})


// @desc get wishlist for logged user
// @route GET /api/v1/wishlist
// @access Protected/user


exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({status: 'success' , result: user.wishlist.length, data: user.wishlist})
})
