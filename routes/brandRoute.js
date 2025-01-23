const express = require('express');
const router = express.Router();
const controller = require('../controllers/brandController');
const { getBrandValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validators/brandValidator');

const authController = require('../controllers/authController');

router.route('/').post(authController.protect, authController.allowedTo('manager', 'admin'), controller.uploadBrandImage, controller.resizeImage, createBrandValidator, controller.createBrand).get(controller.getBrands);
router.route('/:id')
    .get(getBrandValidator, controller.getBrand)
    .put(authController.protect, authController.allowedTo('manager', 'admin'), controller.uploadBrandImage, controller.resizeImage, updateBrandValidator, controller.updateBrand)
    .delete(authController.protect, authController.allowedTo('admin'), deleteBrandValidator, controller.deleteBrand);
    
module.exports = router;