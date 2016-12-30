var express = require('express');
var BookingRouter = express.Router();
var Booking = require('../Models/Menu');

BookingRouter.use('*',function (req, res, next) {
    console.log('Inside Booking Controller!');
    next();
});

//All Routes with /
BookingRouter
    .get('/',function (req, res) {
        Booking.getAllBookings(function (err,Bookings) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retriving All Bookings!'});}
            else{res.json(Bookings);}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        Booking.addBooking(Itm,function (err, Booking) {
            if(err){
                console.log('Error Saving Booking :'+err);
                res.json({'status': 'Error', 'msg' : 'Error Saving Booking!'});
            }
            else{
            res.json({'status': 'Success', 'msg' : Booking.Name + ' Saved Successfully'});}
        });
    });

//All Routes with /:id
BookingRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.getBookingById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Selecting Booking with Id : '+id});}
            res.json(data);
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Booking.deleteBookingById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Deleting Booking with Id : '+id});}
            else{res.json({'status': 'Success', 'msg' : data.Name + ' Deleted Successfully'});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        Booking.UpdateBooking(id,rec_proj,function (err,Booking) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Booking with Id : '+id});}
            res.json({'status': 'Success', 'msg' : Booking.Name+ ' Updated Successfully'});
        });
    });

//Misc Routes
BookingRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            if(name=="default"){
                res.json({_id:"default"});
            }else {
                Booking.checkBookingByName(name, function (err, data) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'status': 'Error', 'msg': 'Error Checking Booking with name : ' + name});
                    }
                    else {
                        res.json(data);
                    }
                });
            }
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Booking.getBookings(term, function (err, Booking) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retriving Booking!'});
            }
            else {
                res.json(Booking);
            }
        })
    })
    .put('/u/Qty/:_Id',function (req, res) {
        var id = req.params['_Id'];
        var Qty = req.body;

        Booking.updateQuantity(id,Qty,function (err,Itm) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Booking Quantity!'});}
            else{res.json({'status': 'Success', 'msg' : Itm.Name+' Quantity Updated Successfully!'});}
        });
    });

module.exports = BookingRouter;