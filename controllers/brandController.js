const brandModel = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middleware/uploadimageMiddleware');
const factory = require('./handlerFactory');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');


// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// image processing
exports.resizeImage = asyncHandler((req, res, next) => { // if we refactor we make multi arguments for this we don't refactoring this
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
    sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
    next();
})


// @desc get list of all brand
// @route GET /api/v1/brand
// @access Public

exports.getBrands = factory.getAll(brandModel);

// @desc Get specific brand by id
// @route GET /api/v1/brand/:id
// @access Public

exports.getBrand = factory.getOne(brandModel);

// then() catch()
// try{} catch{}
// asyncHandler => express error handler (you should take error from express and customize them)


// @desc Create brand
// @route POST /api/v1/brand
// @access Private

exports.createBrand = factory.createOne(brandModel);
    // try {
    // }
    // catch(err) {
    //     res.status(400).json({ error: err.message });
    // }
// search about asyncHandler  for another solution

/* const name = req.body.name;


CategoryModel.create({ name, slug: slugify(name) })
    .then(category => {
    res.status(201).json({ data: category });
    })
    .catch(err => {
    res.status(400).json({ error: err.message });
    }); */


// @desc Update specific brand
// @route PUT /api/v1/brand/:id
// @access Private

exports.updateBrand = factory.updateOne(brandModel);


// @desc Delete specific brand
// @route DELETE /api/v1/brand/:id
// @access Private

exports.deleteBrand = factory.deleteOne(brandModel);

// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//     const id = req.params.id;
//     const brand = await brandModel.findOneAndDelete({ _id: id });

//     if (!brand) {
//         // res.status(404).json({ msg: `No category for this id ${id}` });
//         return next(new ApiError(`No brand for this id ${id}`, 404));
//     }

//     res.status(204).json();
// })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                