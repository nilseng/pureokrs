var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pureokrs'

mongoose.connect(dbURI, {useNewUrlParser: true, useFindAndModify:false});

//Connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to '+ dbURI);
});
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

//Capture app termination/restart events
//To be called when process is restarted or terminated
gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
//For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
//For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app termination', () => {
        process.exit(0);
    });
});

//Register schemas and models
require('./users');
require('./okr');