const mongoose = require('mongoose');
const { Schema } = mongoose;
// create schema
const brandSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Brand required'],
        unique: [true, 'Brand must be unique'],
        minlength: [3, 'Too short Brand name'],
        maxlength: [30, 'Too long Brand name']
    },
    
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, { timestamps: true })

const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.Base_Url}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}

// find all, find one, update
brandSchema.post('init', (doc) => {
    setImageUrl(doc);
})

// create
brandSchema.post('save', (doc) => {
    setImageUrl(doc);
})


// create model
const brandModel = mongoose.model('Brand', brandSchema);

module.exports = brandModel;
