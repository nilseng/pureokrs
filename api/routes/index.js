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
var ctrlUser = require('../controllers/user');

//Company
router.get('/company', auth, ctrlCompany.companyRead);

//OKRs
router.post('/okr', auth, ctrlOkr.create);
router.get('/okr/:id', auth, ctrlOkr.getById)
router.get('/okr/company/:company', auth, ctrlOkr.getCompanyOkrs);
router.get('/okr/keyresults/:okrid', auth, ctrlOkr.getKeyResults);
router.get('/okr/objective/:term', auth, ctrlOkr.getOkrsByObjective);

//Users
router.get('/user/:id', auth, ctrlUser.getUser);
router.get('/user/search/:name', auth, ctrlUser.getUsers);

//Authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;