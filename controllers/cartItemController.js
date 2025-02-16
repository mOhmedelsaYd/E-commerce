const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const ApiError = require('../utils/apiError');


const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach(item => totalPrice += item.price * item.quantity);
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
        cart = await Cart.create({ user: req.user._id, cartItems: [{ product: productId, color, price: product.price }] })
    } else {

    // product exists in cart, update quantity.
        const productIndex = cart.cartItems.findIndex(item => item.product == productId && item.color == color);
        if (productIndex > -1) {
            const productCartItem = cart.cartItems[productIndex];
            productCartItem.quantity += 1;
            cart.cartItems[productIndex] = productCartItem;
        } else {
            // porduct not exist in cart, push product in cartItems array 
            cart.cartItems.push({ product: productId, color, price: product.price });
        }
        
    }

    // Calculate total cart price 
    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200)
        .json({
            status: 'success',
            message: 'product added to cart successfully',
            numberOfCartItems: cart.cartItems.length,
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
    res.status(200).json({status: 'success', numberOfCartItems: cart.cartItems.length, data: cart})
})

// @desc remove specific cart item
// @route DELETE /api/v1/cart/:itemId
// @access Protected/user


exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItems: { _id: req.params.itemId } } },
        { new: true })
    
    
    // Calculate total cart price 
    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200)
        .json({
            status: 'success',
            message: 'remove specific cart item successfully',
            numberOfCartItems: cart.cartItems.length,
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
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() == req.params.itemId);
    if (itemIndex > -1) {
        const cartItems = cart.cartItems[itemIndex];
        cartItems.quantity = quantity;
        cart.cartItems[itemIndex] = cartItems;
    } else {
        return new next(new ApiError(`There is no item for this id ${req.params.itemId}`));
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({status: 'success', numberOfCartItems: cart.cartItems.length, data: cart})
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

    res.status(200).json({status: 'success', numberOfCartItems: cart.cartItems.length, data: cart})

})