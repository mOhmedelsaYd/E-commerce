const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true,
        required: [true, 'name required']
    },

    slug: {
        type: String,
        lowercase: true
    },

    email: {
        type: String, 
        required: [true, 'email required'],
        unique: true,
        lowercase: true
    },

    phone: String,

    profileImage: String,

    password: {
        type: String,
        required: [true, 'password required'],
        minLength : [6, 'too short password']
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: String,
    passwordResetVerified: Boolean
    ,
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },

    active: {
        type: Boolean,
        default: true
    },
    // child reference (one to many) user is parent and product is child and the product wishlist are low (use it when child added to parent are low if child are high use parent reference)
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }],
    addresses: [{
        id: { type: mongoose.Schema.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String
    }]

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;