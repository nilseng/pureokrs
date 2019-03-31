var mongoose = require('mongoose');
var User = mongoose.model('User');

var okrSchema = new mongoose.Schema({
    objective: {
        type: String,
        required: true
    },
    keyResults: [{type: mongoose.Schema.ObjectId, ref: 'KeyResult'}],
    parent: {type: mongoose.Schema.ObjectId, ref: 'Okr'},
    children: [{type: mongoose.Schema.ObjectId, ref: 'Okr'}],
    evaluation: String,
    userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
    company: String
});

mongoose.model('Okr', okrSchema);

var keyResultSchema = new mongoose.Schema({
    okrId: {type: mongoose.Schema.ObjectId, ref: 'Okr'},
    keyResult: {
        type: String,
        required: true,
    },
    progress: Number,
    score: Number,
    evaluation: String
});

mongoose.model('KeyResult', keyResultSchema);