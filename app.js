//taskkill /F /IM node.exe Run this as admin To kill all node Processes
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Path = require('path');
var _ = require('lodash');
var RoutesApi = require('./routes').api;
var config = require("./config");
var passport = require('passport');

var User = require('./Models/User');

var Port = process.env.PORT || config.Online.port;
var path = 'mongodb://'+config.Online.db_host+':'+config.Online.db_port+'/'+config.Online.db;
mongoose.connect(path);
require('./config/passport')(passport);

app.set('view engine','hbs');
app.set('views',Path.join(__dirname,'Views'));
app.use(express.static('Views/ErrorPage'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//***********************************************************
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//Pasport Needed *****************************************
app.use(passport.initialize());

var bcrypt   = require('bcrypt-nodejs');

var LocalStrategy   = require('passport-local').Strategy;
app.use(cookieParser());



//Routes==============
//App MiddleWare For All Routes
app.all('*',function (req,res,next) {
    next();
});

_.forEach(RoutesApi,function (key,value) {
    app.use('/api'+value,key); 
});

app.get('/',function (req,res) {
    res.redirect('/api');
});
app.get('/api',function (req,res) {
    res.render('ErrorPage/index');
});
//Process the signup form
app.get('/api/signup',function (req,res) {
    res.json({msg:'in signup Get'});
});

//****************************************************************************/

// Handle 404
app.use(function(req, res) {
    res.status(400);
    res.render('ErrorPage/index', {title: '404: File Not Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('ErrorPage/index', {title:'500: Internal Server Error', error: error});
});
app.listen(Port,function () {
    console.log('Listening On Port '+Port);
});
