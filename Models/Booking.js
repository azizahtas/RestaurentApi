var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    _TableId : {type : String, required: true},
    _BranchId : {type : String, required: true},
    TNo : {type : Number, required: true},
    _UserId : {type : String, required : true },

    Date : {type : Date, required: true },
    Time : {type : Number, required: true },
    NoOfPersons : {type : Number, required: true },
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
    Booking.find({ "Date" : d },{},{},callback);
};
module.exports.getBookingById = function(Id,callback){
    Booking.findById(Id,{},{},callback);
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

module.exports.checkBookingByName = function (name, callback) {
  Booking.findOne({Name: name},{Name :0,Size:0,Rate:0,__v:0},callback);
};

