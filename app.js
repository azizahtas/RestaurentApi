//taskkill /F /IM node.exe Run this as admin To kill all node Processes
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var Path = require('path');
var _ = require('lodash');
var RoutesApi = require('./routes').api;
var config = require("./config");

var Port = config.port;
var path = 'mongodb://'+config.db_host+':'+config.db_port+'/'+config.db;
mongoose.connect(path);
app.set('view engine','hbs');
app.set('views',Path.join(__dirname,'Views'));

app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://localhost:"+config.client);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('Views/ErrorPage'));
//App MiddleWare For All Routes
app.all('*',function (req,res,next) {
    var token = req.cookies.access_token;
    /*if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }*/
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
/*
// Handle 404
app.use(function(req, res) {
    res.status(400);
    res.render('ErrorPage/index', {title: '404: File Not Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('ErrorPage/index', {title:'500: Internal Server Error', error: error});
});*/
app.listen(Port,function () {
    console.log('Listening On Port '+Port);
});
