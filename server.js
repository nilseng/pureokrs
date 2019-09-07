var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

require('./api/models/db');
require('./api/config/passport');

var routesApi = require('./api/routes/index');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use('/api', routesApi);

//Create link to Angular build directory
var distDir = __dirname + "/dist/";
console.log(distDir);

app.use(express.static(distDir));

var server = app.listen(process.env.PORT || 5000, ()=>{
    var port = server.address().port;
    console.log('App now running on port', port);
});

app.use('/*', express.static(distDir));
app.use('*', express.static(distDir));

//Error handlers
app.use((err, req, res, next) => {
    if(err.name==='UnauthorizedError'){
        res.status(401).json({'message': err.name + ': ' + err.message});
    }
});