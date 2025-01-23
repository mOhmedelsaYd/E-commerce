const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../utils/validators/categoryValidator');
const subCategoryRoute = require('./subCategoryRoute');

const authController = require('../controllers/authController');

router.use('/:categoryId/subCategory', subCategoryRoute);
router.route('/')
    .post(authController.protect, authController.allowedTo('manager', 'admin'),controller.uploadCategoryImage, controller.resizeImage, createCategoryValidator, controller.createCategory)
    .get(controller.getCategories);

router.route('/:id')
    .get(getCategoryValidator, controller.getCategory)
    .put(authController.protect, authController.allowedTo('manager', 'admin'), controller.uploadCategoryImage, controller.resizeImage, updateCategoryValidator, controller.updateCategory)
    .delete(authController.protect, authController.allowedTo('admin'), deleteCategoryValidator, controller.deleteCategory);
module.exports = router;