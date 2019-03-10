var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.SECRET_KEY,
    userProperty: 'payload'
});

var ctrlCompany = require('../controllers/company');
var ctrlAuth = require('../controllers/authentication');

//Company
router.get('/company', auth, ctrlCompany.companyRead);

//Authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;