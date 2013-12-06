
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
		gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
			req.session.login = true;
			req.session.user = results;
			req.session.user.sendmail = false;
			store(req, res);			
		});
	});
};

exports.account = function(req, res){
	if(req.session.login){
		res.render('account', {title : 'Locate It : My Account', login: req.session.login, user : req.session.user, page : ""});
	}
};

exports.accountmaj = function(req, res){
	rest.post(serverAddress+'/users/update/:'+req.session.user.id, {
		data: { name: req.body.name, email: req.body.email, sendEmail: req.body.sendmail},
		});
	req.session.user.name = req.body.name;
	req.session.user.email = req.body.email;
	if(req.body.sendmail){
		req.session.user.sendmail = true;
	}
	else{
		req.session.user.sendmail = false;
	}
	res.redirect('/account');

};

function store (req, res){
	var idd = "";
	rest.post(serverAddress+'/users', {
		  data: { name:req.session.user.name, email: req.session.user.email, sendEmail: req.session.user.sendmail},
		}).on('complete', function (data, response) {
			  if (response != null && response.statusCode == 200) {
				  var response = JSON.parse(data);
				  console.log(response);
				  idd = response.id;
				  req.session.userid = idd;
			  }
			  res.redirect('/');
		});
};

