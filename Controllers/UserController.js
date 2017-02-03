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
    .post('/signup', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password.'});
    } else {
        var user = req.body;
        User.addUser(user,function (err,usr) {
            if (err) {
                res.json({success: false, msg: 'Username already exists.',data:[]});
            }
            else{
            res.json({success: true, msg: 'Successful created new user.',data:[]});
            }
        });
    }
}).post('/login', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password.',data:[]});
    } else {
        var user = req.body;

        User.login(user,function (err,isMatch,who) {
            if(err){
                res.json({success: false, msg: err.msg,data:[]});
            }
            else if(!err && isMatch){
                user.password="";
                user.Who = who;
                var token = jwt.encode(user, config.secret);
                res.json({success: true, token: 'JWT ' + token});
            }
        });
    }
})
;
module.exports = UserRouter;
