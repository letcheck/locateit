
/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , content = require('./routes/content')
  , follow = require('./routes/follow')
  , http = require('http')
  , path = require('path');

var app = express();

var mongoose = require('mongoose');

// all environments
app.set('port', process.env.PORT || 5000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

//cross domain
app.all('*', function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	  res.header('Access-Control-Allow-Headers', 'Content-Type');
	  next();
	});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//let's start the database
//connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/locateit');

//API REST
app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/media/add/:msg/:lat/:long', content.addMedia);//POST after and add picture and all the things
app.post('/media', content.addMedia);
app.post('/picture', content.addPicture);
app.get('/media/:number', content.getMedia);//begin end lat long rayon in get query
app.get('/media/one', content.getOneMedia);
app.delete('/media/:id/:iduser/:password', content.deleteMedia);
app.post('/comment', content.addComment);//:idmedia/:msg/:iduser
app.get('/comment/:idmedia/:nb/:start', content.getComment);
app.delete('/comment/:idcomment/:iduser', content.deleteComment);
app.get('/follow/all/:iduser/:nb?/:start?/:date?', follow.getFollow);
app.get('/follow/:id', follow.getFollowById);
app.post('/follow', follow.addFollow);//iduser, lat, long , rayon 
app.delete('/follow/:iduser/:idfollow', follow.deleteFollow);
app.post('/users', user.add);
app.delete('/users', user.deleteUser);
app.post('/users/update/:iduser', user.updateUser);
app.get('/follow/notification/:iduser/:nb/:start?/:date?', follow.getNotification);
app.post('/follow/notification/read/:iduser/:idnotification', follow.readNotification);
/*app.options('/follow/:iduser/:idfollow', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE');
  res.end();
});*/


http.createServer(app).listen(app.get('port'), function(){
  console.log('server api listening on port ' + app.get('port'));
});
