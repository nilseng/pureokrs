var mongoose = require('mongoose');
var User = mongoose.model('User');

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
                        console.log('Could not find user with name', decodeURIComponent(req.params.name));
                    } else{
                        console.log('Found', users.length, 'users');
                        res.status(200).json(users);
                    }
                })
            }
        }); 
    }
}