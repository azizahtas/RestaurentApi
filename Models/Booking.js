var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    _UserId : {type : String, required : true },
    _TableId : {type : String, required: true},
    _BranchId : {type : String, required: true},
    TNo : {type : Number, required: true},
    Date : {type : String, required: true },
    Time : {type : String, required: true },
    NoOfPersons : {type : Number, required: true },
    Orders : {
        _MenuId : String
    }

},{collection : 'Bookings'});

var Booking = module.exports = mongoose.model('Booking',BookingSchema,'Bookings');

module.exports.getAllBookings = function(callback){
    Booking.find({},callback);
};
module.exports.getBookings = function(Term,callback){
    Booking.find({ "Name" : {"$regex":Term, "$options":"i"} },{},{},callback);
};
module.exports.getBookingById = function(Id,callback){
    Booking.findById(Id,{},{},callback);
};
module.exports.deleteBookingById = function(Id,callback){
    Booking.findByIdAndRemove(Id,{},callback);
};

module.exports.addBooking = function(itm,callback){
    var newBooking = new Booking(itm);
    newBooking.save(callback);
};

module.exports.UpdateBooking = function(Id,itm,callback){
    Booking.findByIdAndUpdate(Id,itm,{},callback);
};

module.exports.checkBookingByName = function (name, callback) {
  Booking.findOne({Name: name},{Name :0,Size:0,Rate:0,__v:0},callback);
};

