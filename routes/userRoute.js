const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { getUserValidator, createUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } = require('../utils/validators/userValidator');

const authController = require('../controllers/authController');

// user
router.get('/getMe', authController.protect, controller.getLoggedUserData, controller.getUser)
router.put('/changePassword', authController.protect, controller.updateLoaggedPassword);
router.put('/changeMe', authController.protect, updateLoggedUserValidator, controller.updateLoggedData);
router.delete('/deactiveMe', authController.protect,  controller.deactiveUser);


// admin
router.route('/changePassword/:id').put(changeUserPasswordValidator,  controller.changeUserPassword)
router.route('/')
    .post(authController.protect, authController.allowedTo('admin'), controller.uploadUserImage, controller.resizeImage, createUserValidator, controller.createUser)
    .get(authController.protect, authController.allowedTo('manager', 'admin'), controller.getUsers);
router.route('/:id')
    .get(authController.protect, authController.allowedTo('admin'), getUserValidator, controller.getUser)
    .put(authController.protect, authController.allowedTo('admin'), controller.uploadUserImage, controller.resizeImage, updateUserValidator,controller.updateUser)
    .delete(authController.protect, authController.allowedTo('admin'), deleteUserValidator, controller.deleteUser);
    
module.exports = router;