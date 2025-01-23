const express = require('express');

const controller = require('../controllers/authController');

const addressesController = require('../controllers/addressesController');

const router = express.Router();

router.use(controller.protect, controller.allowedTo('user'));

router.route('/').post(addressesController.addAddress).get(addressesController.getLoggedUserAddresses);

router.delete('/:addressId', addressesController.removeAddress);

module.exports = router;