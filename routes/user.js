
/*
 * GET users listing.
 */
var sys = require('util'),
    rest = require('restler'),
    gapi = require('../lib/gapi');

var serverAddress = "http://127.0.0.1:5000";
var serverPort = "5000";

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.oauth2callback = function(req, res){
	var code = req.query.code;
	gapi.client.getToken(code, function(err, tokens){
		gapi.client.credentials = tokens;
		gapi.plus.people.get({ userId: 'me' }).withAuthClient(gapi.client).execute(function(err, results){
			req.session.login = true;
			req.session.name = results.displayName;
			store(req, res);
			res.redirect('/');
		});
	});
};

function store (req, res){
	
	rest.post(serverAddress+'/users', {
		  data: { name:req.session.name/*, googleid:req.session.googleid, email: req.session.email*/},
		}).on('complete', function(data, response) {
		  if (response.statusCode == 200) {
			  var response = JSON.parse(data);
			  req.session.id = response.id;
		  }
		});
};