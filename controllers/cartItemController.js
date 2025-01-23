const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const ApiError = require('../utils/ApiError');


const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItem.forEach(item => totalPrice += item.price * item.quantity);
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    
    return;
}

// @desc add product to cart
// @route POST /api/v1/cart
// @access Protected/User


exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);

    // 1) get cart for logged user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // 2) creat cart for logged user 
        cart = await Cart.create({ user: req.user._id, cartItem: [{ product: productId, color, price: product.price }] })
    } else {

    // product exists in cart, update quantity.
        const productIndex = cart.cartItem.findIndex(item => item.product == productId && item.color == color);
        if (productIndex > -1) {
            const productCartItem = cart.cartItem[productIndex];
            productCartItem.quantity += 1;
            cart.cartItem[productIndex] = productCartItem;
        } else {
            // porduct not exist in cart, push product in cartItem array 
            cart.cartItem.push({ product: productId, color, price: product.price });
        }
        
    }

    // Calculate total cart price 
    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200)
        .json({
            status: 'success',
            message: 'product added to cart successfully',
            numberOfCartItems: cart.cartItem.length,
            data: cart
        });
})


// @desc get logged user cart
// @route GET /api/v1/cart
// @access Protected/user

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError(`There is no cart for this user with id: ${req.user._id}`, 404));
    }
    calcTotalCartPrice(cart);
    res.status(200).json({status: 'success', numberOfCartItems: cart.cartItem.length, data: cart})
})

// @desc remove specific cart item
// @route DELETE /api/v1/cart/:itemId
// @access Protected/user


exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItem: { _id: req.params.itemId } } },
        { new: true })
    
    
    // Calculate total cart price 
    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200)
        .json({
            status: 'success',
            message: 'remove specific cart item successfully',
            numberOfCartItems: cart.cartItem.length,
            data: cart
        });
})


// @desc clear cart
// @route DELETE /api/v1/cart
// @access Protected/user


exports.clearCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(204).send();
})


// @desc update specific cart item quantity
// @route PUT /api/v1/cart/:itemId
// @access Protected/user


exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError(`There is no cart for user with id: ${req.user._id}`));
    }
    const itemIndex = cart.cartItem.findIndex(item => item._id.toString() == req.params.itemId);
    if (itemIndex > -1) {
        const cartItem = cart.cartItem[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItem[itemIndex] = cartItem;
    } else {
        return new next(new ApiError(`There is no item for this id ${req.params.itemId}`));
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({status: 'success', numberOfCartItems: cart.cartItem.length, data: cart})
})


// @desc apply coupon
// @route PUT /api/v1/applyCoupon
// @access Protected/user

exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findOne({ name: req.body.coupon, expire: { $gt: Date.now() } });

    if (!coupon) {
        return next(new ApiError('Coupon is invalid or expire'));
    }

    // get logged user cartitem
    const cart = await Cart.findOne({ user: req.user._id });
    const totalPrice = cart.totalCartPrice;
    // calculate price after discount
    const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2);

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({status: 'success', numberOfCartItems: cart.cartItem.length, data: cart})

})