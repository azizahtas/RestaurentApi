var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BranchSchema = new Schema({
    Name : {type : String, required : true },
    Address : {type : String, required : true },
    Location : {
        Lat:String,
        Long:String
    },
    Tables : {
        TNo : Number,
        Booked : Boolean,
        Cap : Number,
        Img_Url : String
    },
    Img_Url : {type : String, required: true}

},{collection : 'Branches'});

var Branch = module.exports = mongoose.model('Branch',BranchSchema,'Branches');

module.exports.getAllBranches = function(callback){
    Branch.find({},callback);
};
module.exports.getBranches = function(Term,callback){
    Branch.find({ "Name" : {"$regex":Term, "$options":"i"} },{},{},callback);
};
module.exports.getBranchById = function(Id,callback){
    Branch.findById(Id,{},{},callback);
};
module.exports.deleteBranchById = function(Id,callback){
    Branch.findByIdAndRemove(Id,{},callback);
};

module.exports.addBranch = function(itm,callback){
    var newBranch = new Branch(itm);
    newBranch.save(callback);
};

module.exports.UpdateBranch = function(Id,itm,callback){
    Branch.findByIdAndUpdate(Id,itm,{},callback);
};

module.exports.checkBranchByName = function(name, callback) {
  Branch.findOne({Name: name},{Name :0,Address :0,Location:0,Tables:0,Img_Url:0,__v:0},callback);
};

