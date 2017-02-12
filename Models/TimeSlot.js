var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeSlotSchema = new Schema({
    StartTime : {type : String, required : true },
    EndTime : {type : String, required : true }
},{collection : 'TimeSlots'});

var TimeSlot = module.exports = mongoose.model('TimeSlot',TimeSlotSchema,'TimeSlots');

module.exports.getAllTimeSlots = function(callback){
    TimeSlot.find({},callback);
};
module.exports.getTimeSlots = function(Term,callback){
    TimeSlot.find({ "Name" : {"$regex":Term, "$options":"i"} },{},{},callback);
};
module.exports.getTimeSlotById = function(Id,callback){
    TimeSlot.findById(Id,{},{},callback);
};
module.exports.deleteTimeSlotById = function(Id,callback){
    TimeSlot.findByIdAndRemove(Id,{},callback);
};

module.exports.addTimeSlot = function(itm,callback){
    var newTimeSlot = new TimeSlot(itm);
    newTimeSlot.save(callback);
};

module.exports.UpdateTimeSlot = function(Id,itm,callback){
    TimeSlot.findByIdAndUpdate(Id,itm,{},callback);
};

module.exports.checkTimeSlotByName = function (name, callback) {
  TimeSlot.findOne({Name: name},{Name :0,Size:0,Rate:0,__v:0},callback);
};

