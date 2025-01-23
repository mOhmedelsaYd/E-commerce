const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/apiFeatures');


exports.deleteOne = (model) => 
    asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const document = await model.findOneAndDelete({ _id: id });

    if (!document) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No document for this id ${id}`, 404));
        }
    
        await document.deleteOne();
    res.status(204).json();
    })

exports.updateOne = (model) => 
    asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id,{...req.body}, { new: true });

    if (!document) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
        
    // trigger "save" event when update review
    document.save();

    res.status(200).json({ data: document });
})

exports.createOne = (model) =>
    asyncHandler(async (req, res) => {

    const newDoc = await model.create(req.body);
    res.status(201).json({ data: newDoc });
    });

exports.getOne = (model, populateOptions) => 
    asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    // build query
    let query = model.findById(id);
    if (populateOptions) {
        query = query.populate(populateOptions);
        }
        
    // execute query
        const document = await query;
    if (!document) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
    })

exports.getAll = (model, modelName = '') => 
    asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    const documentCount = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query).filter().paginate(documentCount).sort().limitFields().search(modelName)
    const { mongooseQuery, paginationResult } = apiFeatures;
        // Execute Query
    const documents = await mongooseQuery;
    res.status(200).json({paginationResult, results: documents.length, data: documents})

})