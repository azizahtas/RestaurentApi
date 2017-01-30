var express = require('express');
var UserRouter = express.Router();
var User = require('../Models/Branch');

UserRouter.use('*',function (req, res, next) {
    console.log('Inside User Controller!');
    next();
});

UserRouter
    .post('/signup', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var user = req.body;
        User.addUser(user,function (err,usr) {
            if (err) {
                return res.json({status: "Error", msg: 'Username already exists.',data:[]});
            }
            res.json({status: "Success", msg: 'Successful created new user.',data:[]});
        });
    }
});
module.exports = UserRouter;
