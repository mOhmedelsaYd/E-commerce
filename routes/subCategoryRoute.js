const express = require('express');
// mergeParams allow us to access paremters on other routers   use categoryId params from category router in subCategory routers
const router = express.Router({mergeParams: true});
const subCategoryController = require('../controllers/subCategoryController');
const subCategoryValidator = require('../utils/validators/subCategoryValidator');

const authController = require('../controllers/authController');

router
    .route('/')
    .post(authController.protect, authController.allowedTo('manager', 'admin'), subCategoryController.setCategoryToBody, subCategoryValidator.createSubCategoryValidator, subCategoryController.createsubCategory)
    .get(subCategoryController.createFilterObj, subCategoryController.getsubCategories);

router
    .route('/:id')
    .get(subCategoryValidator.getSubCategoryValidator, subCategoryController.getsubCategory)
    .put(authController.protect, authController.allowedTo('manager', 'admin'), subCategoryValidator.updateSubCategoryValidator, subCategoryController.updatesubCategory)
    .delete(authController.protect, authController.allowedTo('admin'), subCategoryValidator.deleteSubCategoryValidator, subCategoryController.deletesubCategory);

module.exports = router;