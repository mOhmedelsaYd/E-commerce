const express = require('express');
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');

const {
    signUp,
    login,
    forgetPasswod,
    verifyPassResetCode,
    resetPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupValidator, signUp);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgetPasswod);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router;