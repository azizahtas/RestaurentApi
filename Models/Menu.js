var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MenuItemSchema = new Schema({
    Name : {type : String, required : true },
    HPrice : {type : Number, required: true },
    FPrice : {type : Number, required: true },
    Desc : {type : String, required: true},
    Img_Url : {type : String, required: true},
    Category : {type : String, required: true},
    Type : {type : String, required: true}


},{collection : 'MenuItems'});

var MenuItem = module.exports = mongoose.model('MenuItem',MenuItemSchema,'MenuItems');

module.exports.getAllMenuItems = function(callback){
    MenuItem.find({},callback);
};
module.exports.getMenuItems = function(Term,callback){
    MenuItem.find({ "Name" : {"$regex":Term, "$options":"i"} },{},{},callback);
};
module.exports.getMenuItemById = function(Id,callback){
    MenuItem.findById(Id,{},{},callback);
};
module.exports.deleteMenuItemById = function(Id,callback){
    MenuItem.findByIdAndRemove(Id,{},callback);
};

module.exports.addMenuItem = function(itm,callback){
    var newMenuItem = new MenuItem(itm);
    newMenuItem.save(callback);
};

module.exports.UpdateMenuItem = function(Id,itm,callback){
    MenuItem.findByIdAndUpdate(Id,itm,{},callback);
};

module.exports.checkMenuItemByName = function (name, callback) {
  MenuItem.findOne({Name: name},{Name :0,HPrice:0,FPrice:0,Desc:0,Img_Url:0,Category:0,Type:0,__v:0},callback);
};

