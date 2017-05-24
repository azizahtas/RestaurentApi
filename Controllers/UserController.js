var express = require('express');
var UserRouter = express.Router();
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config').Secret;
var User = require('../Models/User');
var nodemailer = require('nodemailer');
var rand = require('csprng');

var smtpTransport = nodemailer.createTransport({
    service : 'gmail',
   auth : {
       user : "restaurentbooking@gmail.com",
       pass : "restaurent123456"
   }
});

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
    .post('/auth/google', function (req, res) {
        if (!req.body.email || !req.body.token) {
            res.json({ success: false, msg: 'Please pass email and token Sent By Google!', data: [] });
        } 
        else 
          User.userExistsEmailGoogle(req.body.email,function (err,usr) {
            if(err){
                console.log(err);
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
            else if(usr){
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
            else if(!usr){
                 var user = new User();
                    user.google.id = req.body.id;
                    user.google.token = req.body.token;
                    user.google.email = req.body.email;
                    user.google.name = req.body.name;
                    user.otherDetails.who = false;
                    user.otherDetails.bm = false;
                    user.otherDetails.fname = req.body.name.split(' ')[0];
                    user.otherDetails.lname = req.body.name.split(' ')[1];
                    user.otherDetails.phone = "7789456123";
                    user.otherDetails._branchId = "";
                    user.otherDetails.temp_str = "";
            User.addUserGoogle(user, function (err, usr) {
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
            else {
                res.json({success: false, msg: "Something went wrong! Please try Again!",data:[]});
            }
        });
       
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
.post('/forgotPassword', function(req, res) {
    var temp = rand(24,24);
    if (!req.body.email) {
        res.json({success: false, msg: 'Please enter email Id.',data:[]});
    } else {
        var email = req.body.email;
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                console.log("Error While resetting password!");
                console.log(err);
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
            else if(usr){
                usr.otherDetails.temp_str = temp;
                User.updateUser(usr._id,usr.otherDetails,function (err, usr) {
                    if(err){
                        console.log("Error Resetting");
                    }
                    else{
                        var mailOptions = {
                            from: "BookKaro.Com <restaurentbooking@gmail.com>",
                            to: email,
                            subject: "Reset Password ",
                            html: "<b>Hello "+email+".</b>  <p>Code to reset your Password is <h1>"+temp+"</h1></p> Regards, Ronit , From BookKaro.Com Team."
                        };
                        console.log(mailOptions);
                        smtpTransport.sendMail(mailOptions,function (err,response) {
                            
                            if(err){
                                res.json({success: false, msg : "Error While Sending Mail!", data: []});
                            }
                            else{
                                res.json({success: true, msg : "Check your Email and enter the verification code to reset your Password", data: []});
                            }
                        });
                    }
                });
            }
            else if(!usr){
                res.json({success: false, msg: "Sorry the email dose not exist!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
        });
    }
})
    .post('/checkKey', function(req, res) {
    if (!req.body.email) {
        res.json({success: false, msg: 'Please enter email Id.',data:[]});
    } else {
        var email = req.body.email;
        var key = req.body.key;
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                console.log("Error While resetting password!");
                console.log(err);
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
            else if(usr){
                if(key == usr.otherDetails.temp_str){
                  res.json({success: true, msg : "Kay Matched!", data: []});
                }
                else{
                    res.json({success: false, msg : "Error Your key Does not Match!, Please Try Again!", data: []});
                }
            }
            else if(!usr){
                res.json({success: false, msg: "Sorry the email dose not exist!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong! Please try Again!",data:[]});
            }
        });
    }
})
    .post('/resetPassword', function(req, res) {
    if (!req.body.email) {
        res.json({success: false, msg: 'Please enter email Id.',data:[]});
    } else {
        var email = req.body.email;
        var key = req.body.key;
        var newPass = req.body.newPassword;
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                console.log("Error While resetting password!");
                console.log(err);
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
            else if(usr){
                if(key == usr.otherDetails.temp_str){
                    usr.local.password = newPass;
                    User.resetPassword(usr,function (err, user) {
                        if(err){
                            console.log("Error ResetPassword in User Controller");
                            console.log(err);
                            res.json({success: false, msg : "Error While Resetting Password, Please Try Again!", data: []});
                        }
                        else{
                            res.json({success: true, msg : "Password reset Successful!", data: []});
                        }
                    })
                }
                else{
                    res.json({success: false, msg : "Error Your key Does not Match!, Please Try Again!", data: []});
                }
            }
            else if(!usr){
                res.json({success: false, msg: "Sorry the email dose not exist!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong! Please try Again!",data:[]});
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
