var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../Models/User');
var config = require('../config').Secret;

module.exports = function(passport) {

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload);
        User.findOne({"_id": jwt_payload._id}, function (err, user) {
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