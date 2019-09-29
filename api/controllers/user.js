var mongoose = require('mongoose');
var User = mongoose.model('User');
var Okr = mongoose.model('Okr');

module.exports.getUser = (req, res) => {
    //If no user ID exists in the JWT, return a 401
    if(!req.payload._id){
        res.status(401).json({'message': 'UnauthorizedError: User needs to be logged in'});
    }else{
        //Otherwise continue
        User.findById(req.payload._id)
        .exec((err, user)=>{
            if(err){
                res.status(401).json('User not found');
            }else{
                User.findById(req.params.id)
                .exec((err, owner)=>{
                    if(err) res.status(400).json('Owner not found');
                    else res.status(200).json(owner);
                })
            }
        });
    }
}

module.exports.getUsers = (req, res) => {
    //If no user ID exists in the JWT, return a 401
    if(!req.payload._id){
        res.status(401).json({'message': 'UnauthorizedError: User needs to be logged in'});
    }else{
       //Otherwise continue
        User.findById(req.payload._id)
        .exec((err, user)=>{
            if(err){
                res.status(401).json('User not found');
            }else{
                User.find({
                    name: { "$regex": decodeURIComponent(req.params.name), "$options": "i" },
                    company: decodeURIComponent(req.payload.company)
                })
                .exec((err, users)=>{
                    if(err){
                    } else{
                        res.status(200).json(users);
                    }
                })
            }
        }); 
    }
}

module.exports.getCompanyUsers = (req, res) => {
    //If no user ID exists in the JWT, return a 401
    if(!req.payload._id){
        res.status(401).json({'message': 'UnauthorizedError: User needs to be logged in'});
    }else{
       //Otherwise continue
        User.findById(req.payload._id)
        .exec((err, user)=>{
            if(err){
                res.status(401).json('User not found');
            }else{
                User.find({
                    company: decodeURIComponent(req.payload.company)
                })
                .exec((err, users)=>{
                    if(err){
                    } else{
                        res.status(200).json(users);
                    }
                })
            }
        }); 
    }
}

module.exports.deleteUser = (req, res) => {
    if(!req.params.id){
        res.status(400).json({'message':'no user id received by api'})
    }else if(!req.payload._id){
        res.status(401).json({'message':'UnauthorizedError: user does not seem to be logged in'})
    }else{
        User.findByIdAndRemove(req.params.id, (err, doc)=>{
            if(err){
                res.status(400).json('could not delete user w id', req.params.id);
            }else if(decodeURIComponent(req.payload.company)!==doc.company){
                res.status(400).json('cannot delete user from another company');
            }else{
                Okr.updateMany(
                    {userId: req.params.id},
                    {$set: {'userId': undefined}}, (err, doc2) => {
                        if (err) {
                            res.status(400).json({'message':'could not delete OKR owner references'});
                        }else{
                            res.status(200).json({'message':'deleted user and OKR owner references'});
                        }
                    }
                )
            }
        })
    }
}