var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    _TableId : {type : String, required: true},
    _BranchId : {type : String, required: true},
    TNo : {type : Number, required: true},
    _UserId : {type : String, required : true },

    Date : {type : Date, required: true },
    _TimeSlotId : {type : String, required: true },
    NoOfPersons : {type : Number, required: true },
    Canceled : {type : Boolean, required: true },
    Orders : {
        _MenuId : String
    }

},{collection : 'Bookings'});

var Booking = module.exports = mongoose.model('Booking',BookingSchema,'Bookings');

module.exports.getAllBookings = function(callback){
   Booking.find({},callback);
};
module.exports.getBookingsByDate = function(Term,callback){
    var d = new Date(Term);
    Booking.find({ "Date" : d },{},callback);
};
module.exports.getBookingById = function(Id,callback){
    Booking.findById(Id,{},{},callback);
};
module.exports.getBookingByBranchId = function(Id,callback){
    Booking.find({ "_BranchId" : Id},{},callback);
};
module.exports.getBookingByUserId = function(Id,callback){
    Booking.find({ "_UserId" : Id},{},callback);
};
module.exports.getBookingsByCanceled = function(canceled,callback){
    if(canceled) Booking.find({ "Canceled" : canceled},{},callback);
    else Booking.find({ "Canceled" : canceled},{},callback);
};
module.exports.getByTableId = function(Id,callback){
    Booking.find({ "_TableId" : Id},{},callback);
};

module.exports.deleteBookingById = function(Id,callback){
    Booking.findByIdAndRemove(Id,{},callback);
};

module.exports.addBooking = function(booking,callback){
    var newBooking = new Booking(booking);
    newBooking.save(callback);
};

module.exports.UpdateBooking = function(Id,itm,callback){
    Booking.findByIdAndUpdate(Id,itm,{},callback);
};

