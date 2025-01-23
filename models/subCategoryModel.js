const mongoose = require('mongoose');

const { Schema } = mongoose;
const subCategory = new Schema({
    name: {
        type: String,
        trim: true,
        minLength: [2, 'subCategory is too short'],
        maxLength: [32, 'subCategory is too long'],
        unique: [true, 'subCategory must be unique'],
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, 'subCategory must be belong to parent category'],
    }
}, { timestamps: true }) 


module.exports = mongoose.model('subCategory', subCategory)