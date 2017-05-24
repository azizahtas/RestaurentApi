// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    otherDetails :{
        who : {type : Boolean, required : true },
        bm : {type : Boolean, required : true },
        fname : {type : String, required : true },
        lname : {type : String, required : true },
        phone:{type : String, required : true },
        _branchId : String,
        temp_str : {type : String, default: ""  },
    }

},{collection : 'Users'});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
var User = module.exports  = mongoose.model('User', userSchema,'Users');

module.exports.addUser = function(user,callback){
    User.findOne({"local.email":user.local.email},{},function (err, usr) {
        if(usr){
            callback({msg:"User Already Exists"});
            console.log("User Exists");
        }
        else {
            var newUser = new User(user);
            newUser.local.email = user.local.email;
            newUser.local.password = newUser.generateHash(user.local.password);
            newUser.otherDetails.who = false;
            newUser.otherDetails.bm = user.otherDetails.bm;
            newUser.otherDetails.fname = user.otherDetails.fname;
            newUser.otherDetails.lname = user.otherDetails.lname;
            newUser.otherDetails.phone = user.otherDetails.phone;
            newUser.save(callback);
        }
    });
};

module.exports.addUserGoogle = function(user,callback){
    User.findOne({"google.email":user.google.email},{},function (err, usr) {
        if(usr){
            callback({msg:"User Already Exists"});
            console.log("User Exists");
        }
        else {
            var newUser = new User(user);
            newUser.save(callback);
        }
    });
};

module.exports.updateUser = function(Id,otherDetails,callback){
    User.findById(Id,{},function (err, usr) {
        if(usr){
            var newUser = new User(usr);
            newUser.otherDetails.who = false;
            newUser.otherDetails.bm = otherDetails.bm;
            newUser.otherDetails.fname = otherDetails.fname;
            newUser.otherDetails.lname = otherDetails.lname;
            newUser.otherDetails.phone = otherDetails.phone;
            newUser.otherDetails._branchId = otherDetails._branchId;
            newUser.otherDetails.temp_str = otherDetails.temp_str;
            console.log(newUser);
            newUser.save(callback);
        }
        else {
             callback({msg:"User Doesnot Exist"});
        }
    });
};
module.exports.deleteUserById = function(Id,callback){
    User.findByIdAndRemove(Id,{},callback);
};

module.exports.login = function(user,callback){
    User.findOne({"local.email":user.email},{},function (err, usr) {
        if(err){
            err.msg = 'Authentication Failed! UserName does not exist!';
            console.log("Duhh2");
            callback(err,false,null);
        }
        if(usr){

            if(usr.validPassword(user.password)){
                console.log("Duhh3");
                callback(null,true,usr);
            }
            else {
                console.log("Duhh4");
                callback(null,false,null);
            }
        }
        else if(!usr) {
            callback({msg:'Authentication Failed! Email does not exist!'},false,null);
        }
    });
};
module.exports.resetPassword = function(user,callback){
    User.findOne({"_id":user._id},{},function (err,usr) {
        var newPass = new User(usr);
        newPass.local.password = newPass.generateHash(user.local.password);
        newPass.otherDetails.temp_str = "";
        
        newPass.save(callback);
    });
};
module.exports.userExistsId = function(user,callback){
    User.findOne({"_id":user._id},{},callback);
};
module.exports.userExistsEmail = function(email,callback){
    User.findOne({"local.email":email},{},callback);
};
module.exports.userExistsEmailGoogle = function(email,callback){
    User.findOne({"google.email":email},{},callback);
};
module.exports.getAllUsers = function(callback){
    User.find({"otherDetails.who":false},callback);
};
