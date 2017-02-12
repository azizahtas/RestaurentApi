var express = require('express');
var UserRouter = express.Router();
var User = require('../Models/User');
var jwt = require('jwt-simple');
var config = require("../config");

UserRouter.use('*',function (req, res, next) {
    console.log('Inside User Controller!');
    next();
});

UserRouter
    .get('/checkUser/:_email',function (req, res) {
        var email = req.params['_email'];
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                res.json({success: false, msg: 'Something Went Wrong', data:[]});
            }
            else{
                if(usr){
                    res.json({success: true, msg: 'User Exists', data:[]});
                }
                else{
                    res.json({success: false, msg: 'User Does not Exist', data:[]});
                }
            }
        })
    })
    .post('/signup', function(req, res) {
    if (!req.body.local.email || !req.body.local.password) {
        res.json({success: false, msg: 'Please pass email and password.', data:[]});
    } else {
        var user = req.body;
        User.addUser(user,function (err,usr) {
            if (err) {
                res.json({success: false, msg: 'Email already exists.',data:[]});
            }
            else{
                var newUser = {
                    who : usr.otherDetails.who,
                    _id : usr._id,
                    fname : usr.otherDetails.fname,
                    lname : usr.otherDetails.lname
                };
                var token = jwt.encode(newUser, config.secret);
                res.json({success: true, msg : "Successfully Logged In!", data: token});
            }
        });
    }
}).post('/login', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password.',data:[]});
    } else {
        var user = req.body;

        User.login(user,function (err,isMatch,usr) {
            if(err){
                res.json({success: false, msg: err.msg,data:[]});
            }
            else if(!err && isMatch && usr){
                var newUser = {
                    who : usr.otherDetails.who,
                    _id : usr._id,
                    fname : usr.otherDetails.fname,
                    lname : usr.otherDetails.lname
                };
                var token = jwt.encode(newUser, config.secret);
                res.json({success: true, msg : "Successfully Logged In!", data: token});
            }
            else if(!err && !isMatch && !usr){
                res.json({success: false, msg: "Sorry Your password Does not match!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
        });
    }
})
;
module.exports = UserRouter;
