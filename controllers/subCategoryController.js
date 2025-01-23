const slugify = require('slugify');
const subCategoryModel = require('../models/subCategoryModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');


// nested route
// Get /api/v1/category/:categoryId/subCategory

// @desc get list of all subCategory
// @route GET /api/v1/subCategory
// @access Public

exports.createFilterObj = (req, res, next) => {
    let filterObj = {};
    if (req.params.categoryId) filterObj = { category: req.params.categoryId };
    req.filterObj = filterObj;
    next();
}

exports.getsubCategories = factory.getAll(subCategoryModel);

// @desc Get specific subCategory by id
// @route GET /api/v1/subCategory/:id
// @access Public

exports.getsubCategory = factory.getOne(subCategoryModel);


// nested route
// Post /api/v1/category/:categoryId/subCategory
exports.setCategoryToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}
// @desc Create subCategory
// @route POST /api/v1/subCategory
// @access Private

exports.createsubCategory = factory.createOne(subCategoryModel);


// @desc Update specific subCategory
// @route PUT /api/v1/subCategory/:id
// @access Private

exports.updatesubCategory = factory.updateOne(subCategoryModel);


// @desc Delete specific subCategory
// @route DELETE /api/v1/subCategory/:id
// @access Private

exports.deletesubCategory = factory.deleteOne(subCategoryModel);

// exports.deletesubCategory = asyncHandler(async (req, res, next) => {
//     const id = req.params.id;
//     const subCategory = await subCategoryModel.findOneAndDelete({ _id: id });

//     if (!subCategory) {
//         // res.status(404).json({ msg: `No subCategory for this id ${id}` });
//         return next(new ApiError(`No subCategory for this id ${id}`, 404));
//     }

//     res.status(204).json({ msg: `subCategory Deleted` });
// })