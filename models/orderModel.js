const mongoose = require('mongoose');
const { bool } = require('sharp');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: Number,
            color: String,
            price: Number
        }
    ],
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String, 
        postalCode: String
    }
    ,
    shippingPrice: {
        type: Number,
        default: 0
    },
    TotalOrderPrice: Number,
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },

    paidAt: Date,

    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date

}, { timeStamp: true });

orderSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name profileImg email phone' }).populate({ path: 'cartItems.product', select: 'title imageCover' })
    next()
})

module.exports = mongoose.model('Order', orderSchema);

