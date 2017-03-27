var express = require('express');
var BookingRouter = express.Router();
var Booking = require('../Models/Booking');
var passport =require('passport');
var jwt =require('jwt-simple');
var config = require('../config').Secret;
var User = require('../Models/User');

BookingRouter.use('*',function (req, res, next) {
    console.log('Inside Booking Controller!');
    next();
});

//All Routes with /
BookingRouter
    .get('/',passport.authenticate('jwt',
        {
            session: false
        }),
        function (req, res) {
            var token = this.getToken(req.headers);
            if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                Booking.getAllBookings(function (err,Bookings) {
                    if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retriving All Bookings!', data:[]});}
                    else{res.json({'success': true, 'msg' : 'Error Retriving All Bookings!', data:Bookings});}
                });
            });
        }
    })
    .post('/',passport.authenticate('jwt',
        {
            session: false
        }),
        function (req, res) {
            var token = this.getToken(req.headers);
            if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                var booking = req.body;
                Booking.addBooking(booking,function (err, booking) {
                    if(err){
                        console.log('Error Saving Booking :'+err);
                        res.json({'success': false, 'msg' : 'Error Saving Booking!'});
                    }
                    else{
                    res.json({'success': true, 'msg' :'Booking Saved Successfully'});}
                });
            });
        }
    });

//All Routes with /:id
BookingRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.getBookingById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Selecting Booking with Id : '+id,data:[]});}
            res.json({'success': true, 'msg' : 'We found Booking with Id : '+id,data:data});
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.deleteBookingById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Deleting Booking with Id : '+id});}
            else{res.json({'success' : true, 'msg' :'Booking Deleted Successfully', data : []});}

        });
    })
    .put('/Cancel/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.CancelBooking(id,function (err,Booking) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Canceling Booking with Id : '+id, data : []});}
            res.json({'success': true, 'msg' : ' Booking Canceled Successfully', data : []});
        });
    }).put('/Arrived/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.ArrivedBooking(id,function (err,Booking) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Arrived Booking with Id : '+id, data : []});}
            res.json({'success': true, 'msg' : 'Success Setting Booking Status as Arrived!', data : []});
        });
    }).put('/Open/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.StatusOpen(id,function (err,Booking) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Editing Booking with Id : '+id});}
            res.json({'success': true, 'msg' :'Success Opening Booking Status!', data : []});
        });
    }).put('/:_id',function (req, res) {
    var id = req.params['_id'];
    var rec_proj = req.body;
    Booking.UpdateBooking(id,rec_proj,function (err,Booking) {
        if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Editing Booking with Id : '+id, data:[]});}
        res.json({'success': true, 'msg' : Booking.Name+ ' Updated Successfully', data:[]});
    });
});

//Misc Routes
// Routs With /u/Term
BookingRouter
    .get('/u/:_term',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res) {
            var name = req.params['_term'];
            if(name=="Canceled"){
                Booking.getBookingsByCanceled(true, function (err, bookings) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'success': false, 'msg': 'Error While reteriving Canceled Bookings!', data:[]});
                    }
                    else {
                         res.json({'success': true, 'msg': 'We Found All The Canceled Bookings!', data:bookings});
                    }
                });
            }
            else if(name=="NotCanceled"){
                Booking.getBookingsByCanceled(false, function (err, bookings) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'success': false, 'msg': 'Error While reteriving Not Canceled Bookings!', data:[]});
                    }
                    else {
                         res.json({'success': true, 'msg': 'We Found Bookings Not Canceled', data:bookings});
                    }
                });
            }
            else {
                res.json({'success': false, 'msg': 'Wrong Path!', data : []});
               
            }
    })
//Routes With /u/Term/Data
BookingRouter
    .get('/u/:_term/:_id',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res) {
            
            var name = req.params['_term'];
            var id = req.params['_id'];
            if(name=="UserId"){
                Booking.getBookingByUserId(id, function (err, bookings) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'success': false, 'msg': 'Error Reteriving Bookings with User Id : '+id, data:[]});
                    }
                    else {
                         res.json({'success': true, 'msg': 'We Found All Bookings with User Id: '+id, data:bookings});
                    }
                });
            }
            else if(name=="BranchId"){
                Booking.getBookingByBranchId(id, function (err, bookings) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'success': false, 'msg': 'Error Reteriving Bookings with branch Id : '+id, data:[]});
                    }
                    else {
                         res.json({'success': true, 'msg': 'We Found All Bookings with Branch Id: '+id, data:bookings});
                    }
                });
            }
            else if(name=="TableId"){
                Booking.getBookingByTableId(id, function (err, bookings) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'success': false, 'msg': 'Error Reteriving Bookings with Table Id : '+id, data:[]});
                    }
                    else {
                         res.json({'success': true, 'msg': 'We Found All Bookings with Table Id: '+id, data:bookings});
                    }
                });
            }
            else {
                res.json({'success': false, 'msg': 'Wrong Path!', data : []});
               
            }
    })


module.exports = BookingRouter;
