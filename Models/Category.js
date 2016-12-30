var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    Name : {type : String, required : true }
},{collection : 'Categories'});

var Category = module.exports = mongoose.model('Category',CategorySchema,'Categories');

module.exports.getAllCategories = function(callback){
    Category.find({},callback);
};
module.exports.getCategories = function(Term,callback){
    Category.find({ "Name" : {"$regex":Term, "$options":"i"} },{},{},callback);
};
module.exports.getCategoryById = function(Id,callback){
    Category.findById(Id,{},{},callback);
};
module.exports.deleteCategoryById = function(Id,callback){
    Category.findByIdAndRemove(Id,{},callback);
};

module.exports.addCategory = function(itm,callback){
    var newCategory = new Category(itm);
    newCategory.save(callback);
};

module.exports.UpdateCategory = function(Id,itm,callback){
    Category.findByIdAndUpdate(Id,itm,{},callback);
};

module.exports.checkCategoryByName = function (name, callback) {
  Category.findOne({Name: name},{Name :0,Size:0,Rate:0,__v:0},callback);
};

