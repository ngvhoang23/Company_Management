var express = require('express');
var router = express.Router();

const LoginController = require('../app/controllers/LoginController');

router.post('/login', LoginController.access);

module.exports = router;
