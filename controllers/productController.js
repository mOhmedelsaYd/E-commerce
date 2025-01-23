const productModel = require('../models/productModel');
const factory = require('./handlerFactory');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp'); 
const { uploadMixOfImages } = require('../middleware/uploadimageMiddleware');


exports.uploadProductImages =
    uploadMixOfImages([
        { name: 'imageCover', maxCount: 1 },
        { name: 'images', maxCount: 8 }
    ])




exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    console.log(req.files);
  //1- Image processing for imageCover
if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;

    }
  //2- Image processing for images
    if (req.files.images) {
    req.body.images = [];
    await Promise.all(
    req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

    await sharp(img.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
    })
    );
    
  }
  next();
});

// @desc get list of all products        
// @route GET /api/v1/product
// @access Public

exports.getProducts = factory.getAll(productModel, 'Product');
    // 1) filtering
    // const queryStringObject = { ...req.query };
    // const deletedFields = ['page', 'limit', 'sort', 'fields'];
    // deletedFields.forEach(field => delete queryStringObject[field]);
    // // apply filteration using (gte or gt or lte or lt)
    // let queryStr = JSON.stringify(queryStringObject);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    // 2) pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 50;
    // const skip = (page - 1) * limit;

    // build Query 

    
    // // sort   ascending (+), descending(-) from higher to lower
    // if (req.query.sort) {
    //     // convert from -sold,price => -sold price
    //     mongooseQuery = mongooseQuery.sort(req.query.sort.split(',').join(' '));
    // } else {
    //     mongooseQuery = mongooseQuery.sort('-createAt')  // if we don't give me a sort
    // }

    // fields 
    // if (req.query.fields) {
    //     const fields = req.query.fields.split(',').join(' ');
    //     mongooseQuery = mongooseQuery.select(fields);
    // } else {
    //     mongooseQuery = mongooseQuery.select('-__v');
    // }


    // search 
    // if (req.query.keyword) {
        
    //     const query = {}
    //         query.$or =  [
    //             { title: { $regex: req.query.keyword, $options: 'i' } },
    //             { description: { $regex: req.query.keyword, $options: 'i' } },
    //         ]
    
    //     console.log(query);
    //     mongooseQuery = mongooseQuery.find(query);
    // }



// @desc Get specific product by id
// @route GET /api/v1/product/:id
// @access Public

exports.getProduct = factory.getOne(productModel, 'reviews');

// @desc Create product
// @route POST /api/v1/product
// @access Private

exports.createProduct = factory.createOne(productModel);


// @desc Update specific product
// @route PUT /api/v1/product/:id
// @access Private

exports.updateProduct = factory.updateOne(productModel);


// @desc Delete specific product
// @route DELETE /api/v1/product/:id
// @access Private

exports.deleteProduct = factory.deleteOne(productModel);

// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//     const id = req.params.id;
//     const product = await productModel.findOneAndDelete({ _id: id });

//     if (!product) {
//         // res.status(404).json({ msg: `No category for this id ${id}` });
//         return next(new ApiError(`No product for this id ${id}`, 404));
//     }

//     res.status(204).json({ msg: `Product Deleted` });
// })