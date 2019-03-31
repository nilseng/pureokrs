var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.SECRET_KEY,
    userProperty: 'payload'
});

var ctrlCompany = require('../controllers/company');
var ctrlAuth = require('../controllers/authentication');
var ctrlOkr = require('../controllers/okr');

//Company
router.get('/company', auth, ctrlCompany.companyRead);

//OKRs
router.post('/okr', auth, ctrlOkr.create);
router.get('/okr/company/:company', auth, ctrlOkr.getCompanyOkrs);
router.get('/okr/keyresults/:okrid', auth, ctrlOkr.getKeyResults);

//Authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;