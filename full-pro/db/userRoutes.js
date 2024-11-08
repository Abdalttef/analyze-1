const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.post('/register', userController.register);
//router.post('/login', userController.login);
router.post('/change-password', userController.changePassword);
router.post('/logout', userController.logout);
router.get('/test', userController.test);

module.exports = router;
