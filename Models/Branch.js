var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BranchSchema = new Schema({
    Name : {type : String, required : true },
    Location : {
        Lat:{type : Number, required: true },
        Long:{type : Number, required: true }
    },
    Tables : {
        TNo : {type : Number, required: true },
        Stat : {type : Number, required: true },
        Capacity : {type : Number, required: true },
        Img_Url : {type : Number, required: true }
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

module.exports.checkBranchByName = function (name, callback) {
  Branch.findOne({Name: name},{Name :0,Size:0,Rate:0,__v:0},callback);
};

