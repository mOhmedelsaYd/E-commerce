const express = require('express');
const router = express.Router();
const reviewRoute = require('./reviewRoute');
const controller = require('../controllers/productController');
const { getProductValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/productValidator');

// nested route

// POST /product/8459u34u40/review
// GET /product/8459u34u40/review
// GET /product/8459u34u40/review/4657377543
router.use('/:productId/review', reviewRoute)
const authController = require('../controllers/authController');

router.route('/').post(authController.protect, authController.allowedTo('manager', 'admin'), controller.uploadProductImages, controller.resizeProductImages, createProductValidator, controller.createProduct).get(controller.getProducts);
router.route('/:id')
    .get(getProductValidator, controller.getProduct)
    .put(authController.protect, authController.allowedTo('manager', 'admin'), updateProductValidator, controller.updateProduct)
    .delete(authController.protect, authController.allowedTo('admin'), deleteProductValidator, controller.deleteProduct);
module.exports = router;