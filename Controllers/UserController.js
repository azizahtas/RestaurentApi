var express = require('express');
var UserRouter = express.Router();
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config');
var User = require('../Models/User');

UserRouter.use('*', function (req, res, next) {
    console.log('Inside User Controller!');
    next();
});

UserRouter
    .get('/checkUser/:_email', function (req, res) {
        var email = req.params['_email'];
        User.userExistsEmail(email, function (err, usr) {
            if (err) {
                res.json({ success: false, msg: 'Something Went Wrong', data: [] });
            }
            else {
                if (usr) {
                    res.json({ success: true, msg: 'User Exists', data: [] });
                }
                else {
                    res.json({ success: false, msg: 'User Does not Exist', data: [] });
                }
            }
        })
    })
    .post('/signup', function (req, res) {
        if (!req.body.local.email || !req.body.local.password) {
            res.json({ success: false, msg: 'Please pass email and password.', data: [] });
        } else {
            var user = req.body;
            User.addUser(user, function (err, usr) {
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: 'Email already exists.', data: [] });
                }
                else {
                    var newUser = {
                        who: usr.otherDetails.who,
                        bm: usr.otherDetails.bm,
                        _id: usr._id,
                        fname: usr.otherDetails.fname,
                        lname: usr.otherDetails.lname,
                        _branchId: usr.otherDetails._branchId
                    };
                    var token = jwt.encode(newUser, config.secret);
                    res.json({ success: true, msg: "Successfully Logged In!", data: token });
                }
            });
        }
    })
    .post('/login', function (req, res) {
        if (!req.body.email || !req.body.password) {
            res.json({ success: false, msg: 'Please pass email and password.', data: [] });
        } else {
            var user = req.body;

            User.login(user, function (err, isMatch, usr) {
                if (err) {
                    res.json({ success: false, msg: err.msg, data: [] });
                }
                else if (!err && isMatch && usr) {
                    var newUser = {
                        who: usr.otherDetails.who,
                        bm: usr.otherDetails.bm,
                        _id: usr._id,
                        fname: usr.otherDetails.fname,
                        lname: usr.otherDetails.lname,
                        _branchId: usr.otherDetails._branchId
                    };
                    var token = jwt.encode(newUser, config.secret);
                    res.json({ success: true, msg: "Successfully Logged In!", data: token });
                }
                else if (!err && !isMatch && !usr) {
                    res.json({ success: false, msg: "Sorry Your password Does not match!", data: [] });
                }
                else {
                    res.json({ success: false, msg: "Something went wrong!", data: [] });
                }
            });
        }
    })
    ;

UserRouter
    .get('/', passport.authenticate('jwt',
        {
            session: false
        }), function (req, res, next) {
            var token = this.getToken(req.headers);
            if (token) {
                var decoded = jwt.decode(token, config.secret);
                User.userExistsId(decoded, function (err, user) {
                    if (user) {
                        if (user.otherDetails.who || user.otherDetails.bm) {
                            User.getAllUsers(function (err, users) {
                                if (err) {
                                    console.log('Error Reteriving Users! :' + err);
                                    res.json({ 'success': false, 'msg': 'Error Reteriving Users!!', data: [] });
                                }
                                else {
                                    var newUsers = [];
                                    var Ids = [];
                                    for (var i = 0; i < users.length; i++) {
                                        newUsers.push(users[i].otherDetails);
                                    }
                                    for (var i = 0; i < users.length; i++) {
                                        Ids.push(users[i]._id);
                                    }

                                    res.json({ 'success': true, 'msg': 'We Found what your looking for!', data: { Users: newUsers, Ids: Ids } });
                                }
                            });
                        }
                        else {
                            res.json({ 'success': false, 'msg': 'Your are not admin to do this!!', data: [] });
                        }
                    }
                    else {
                        res.json({ 'success': false, 'msg': 'User Doesnot Exist!!', data: [] });
                    }

                });
            }
        })
    .put('/:_id', passport.authenticate('jwt',
        {
            session: false
        }), function (req, res) {
            var token = this.getToken(req.headers);
            if (token) {
                var decoded = jwt.decode(token, config.secret);
                User.userExistsId(decoded, function (err, user) {
                    var id = req.params['_id'];
                    if (user.otherDetails.who) {
                        var userDetails = req.body;
                        User.updateUser(id, userDetails, function (err, newusr) {
                            if (err) { console.log('Error :' + err.msg); res.json({ 'success': false, 'msg': 'Error Editing newusr with Id : ' + id + 'Error :' + err.msg, data: [] }); }
                            else {
                                res.json({ 'success': true, 'msg': ' Updated Successfully', data: user._id });
                            }
                        });
                    }
                    else {
                        res.json({ 'success': false, 'msg': 'Your are not admin to do this!!', data: {} });
                    }
                });
            }
        })
    .delete('/:_id', passport.authenticate('jwt',
        {
            session: false
        }), function (req, res, next) {
            var token = this.getToken(req.headers);
            if (token) {
                var decoded = jwt.decode(token, config.secret);
                User.userExistsId(decoded, function (err, user) {
                    if (user.otherDetails.who) {
                        var id = req.params['_id'];
                        User.deleteUserById(id, function (err, user) {
                            if (err) { console.log('Error :' + err.msg); res.json({ 'success': false, 'msg': 'Error Deleting User with Id : ' + id + 'Error :' + err.msg, data: [] }); }
                            else { res.json({ 'success': true, 'msg': user.Name + ' Deleted Successfully', data: [] }); }
                        });
                    }
                    else {
                        res.json({ 'success': false, 'msg': 'Your are not admin to do this!!', data: {} });
                    }
                });
            }
        });
module.exports = UserRouter;
