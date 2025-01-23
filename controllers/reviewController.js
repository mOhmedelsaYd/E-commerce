const asyncHandler = require('express-async-handler');
const reviewModel = require('../models/reviewModel');
const factory = require('./handlerFactory');




// nested route
// Get /api/v1/category/:categoryId/subCategory

// @desc get list of all subCategory
// @route GET /api/v1/subCategory
// @access Public

exports.createFilterObj = (req, res, next) => {
    let filterObj = {};
    if (req.params.productId) filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
    next();
}


// @desc get list of all reviews
// @route GET /api/v1/review
// @access Public

exports.getReviews = factory.getAll(reviewModel);

// @desc Get specific review by id
// @route GET /api/v1/review/:id
// @access Public

exports.getReview = factory.getOne(reviewModel);

// then() catch()
// try{} catch{}
// asyncHandler => express error handler (you should take error from express and customize them)

// nested route
// Post /api/v1/product/:productId/review
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
}


// @desc Create review
// @route POST /api/v1/review
// @access Private/Protect/User

exports.createReview = factory.createOne(reviewModel);
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


// @desc Update specific review
// @route PUT /api/v1/review/:id
// @access Private/Protect/User

exports.updateReview = factory.updateOne(reviewModel);


// @desc Delete specific review
// @route DELETE /api/v1/review/:id
// @access Private/Protect/User-Admin-Manager

exports.deleteReview = factory.deleteOne(reviewModel);

// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//     const id = req.params.id;
//     const brand = await brandModel.findOneAndDelete({ _id: id });

//     if (!brand) {
//         // res.status(404).json({ msg: `No category for this id ${id}` });
//         return next(new ApiError(`No brand for this id ${id}`, 404));
//     }

//     res.status(204).json();
// })