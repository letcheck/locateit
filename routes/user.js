
/*
 * GET users listing.
 */
var Content = require('../models/userModel.js');

exports.list = function(req, res){
  	res.send("respond with a resource");
};

exports.add = function(req, res){
	res.send('{"status" : "ok", "id" : "dhfhdfd"}');
	console.log(req.body.name);
};

exports.deleteUser = function(req, res){
	res.send("respond with a resource");
};

exports.updateUser = function(req, res){
	res.send("respond with a resource");
};