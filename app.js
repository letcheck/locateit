
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , poststh = require('./routes/post')
  , http = require('http')
  , path = require('path')
  , gapi = require('./lib/gapi')
  ,	rest = require('restler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'something', 
	cookie: { 
	  expires: new Date(Date.now() + 60 * 10000), 
	  maxAge: 60*10000
	}}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(rest);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/post', poststh.poststh);
app.get('/api', routes.api);
app.get('/login', function(req, res){
	res.redirect(gapi.url);
});
app.get('/oauth2callback', user.oauth2callback);
app.get('/account', user.account);
app.post('/account', user.accountmaj);
app.get('/logout', function(req, res){
	gapi.client.revokeToken();
	req.session.login = false;
	req.session.name = "";
	req.session.userid = "";
	res.redirect('/');
});
app.get('/follow', function(req, res){
	res.render('follow', { title: 'Locate It', login: req.session.login, page : "myplaces", userid : req.session.userid });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
