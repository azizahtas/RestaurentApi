var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../Models/User');
var config = require('../config');

 var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.Secret.secret;

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload);
        User.findOne({"_id":ObjectId(jwt_payload._id)}, function (err, user) {
            if(err){
                return done(err,false);
            }
            if(user){ 
                done(null, user);
            }
            else{
                done(null, false);
            }
        })
    }));
// =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : config.auth.googleAuth.clientID,
        clientSecret    : config.auth.googleAuth.clientSecret,
        callbackURL     : config.auth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email
                    
                    
                    console.log(newUser)
                    // save the user
                   /* newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });*/
                }
            });
        });

    }));



    /*
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            console.log('Yeah Its In');
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                console.log('1');
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    console.log('2');
                    // if there are any errors, return the error
                    if (err) {console.log("Error Occured");
                        return done(err);}

                    // check to see if theres already a user with that email
                    if (user) {
                        console.log('3');
                        return done(null, false, {status:"Error",msg:"User Already Exists!"});
                    } else {
                        console.log('4');
                        // if there is no user with that email
                        // create the user
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);
                        console.log('5');
                        // save the user
                        newUser.save(function(err) {
                            console.log('6');
                            if (err){
                                console.log("Error Occured Range");
                                console.log('7');
                                throw err;
                            }
                            console.log('8');
                            console.log(newUser);
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));
*/
};