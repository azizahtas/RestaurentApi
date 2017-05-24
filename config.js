module.exports.Online = {
	"port" : 5555,
	"client" : 3000,
	"db" : "RestDb",
	"db_host" : "localhost",
	"db_port" : 27017,
	"api_host" : "localhost",
	"client_host": "localhost",
	"client_port" : 4200
};
module.exports.Local = {
	"port" : 5555,
	"client" : 3000,
	"db" : "restdb",
	"db_host" : "ronit:root@ds135800.mlab.com",
	"db_port" : 35800,
	"api_host" : "restaurentapiserver.herokuapp.com",
	"client_host": "http://bookkaro.byethost15.com/",
	"client_port" : ''
};

module.exports.Secret = {
	"secret": "AzizAhtasIsAPro"
};

// expose our config directly to our application using module.exports
module.exports.auth = {

    facebookAuth : {
        clientID      : 'your-secret-clientID-here', // your App ID
        clientSecret  : 'your-client-secret-here', // your App Secret
        callbackURL   : 'http://localhost:8080/auth/facebook/callback'
    },
	    twitterAuth : 
	{
        consumerKey      : 'your-consumer-key-here',
        consumerSecret    : 'your-client-secret-here',
        callbackURL       : 'http://localhost:8080/auth/twitter/callback'
    },
    googleAuth : {
        clientID      : '103506144227-7kqf32ajt6dlf1mecho39tj02nu8d1dc.apps.googleusercontent.com',
        clientSecret  : 'V96U12DXYcBX4FSI38BvHrgo',
        callbackURL   : 'http://localhost:5555/api/user/auth/google/callback'
    }
}