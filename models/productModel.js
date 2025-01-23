const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'too short product title'],
        maxLength: [100, 'too long product title']
    },

    slug: {
        type: String,
        required: true,
        lowercase: true
    },

    description: {
        type: String,
        required: [true, 'product description is required'],
        minLength: [3, 'too short product description']
    },

    quantity: {
        type: Number,
        required: [true, 'product quantity is required']
    },

    sold: {
        type: Number,
        default: true
    },

    price: {
        type: Number,
        required: [true, 'product price is required'],
        trim: true,
        max: [200000, 'too long product price'] // max with number and date  - maxLength with string 
    },

    priceAfterDiscount: {
        type: Number
    },

    colors: {
        type: [String],
        required: true
    },

    imageCover: {
        type: String,
        required: [true, 'product image cover is required']
    },

    images: [String],

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'product must be belong to category']
    },

    subCategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',

    }],

    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },

    ratingsAverage: {
        type: Number,
        min: [1, 'rating must be above or equal 1.0'],
        max: [5, 'rating must be below or equal 5.0']
    },

    ratingsQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// virtual middleware

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
})

// mongoose query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id'
    })
    next();
})


const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.Base_Url}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const imageList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.Base_Url}/products/${image}`;
            imageList.push(imageUrl);
            doc.images = imageList;
        })
    }
}

// find all, find one, update
productSchema.post('init', (doc) => {
    setImageUrl(doc);
})

// create
productSchema.post('save', (doc) => {
    setImageUrl(doc);
})

module.exports = mongoose.model('Product', productSchema);