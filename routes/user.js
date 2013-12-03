
/*
 * GET users listing.
 */
var User = require('../models/userModel.js');
var crypto = require('crypto');

exports.list = function(req, res){
  	res.send("respond with a resource");
};

exports.add = function(req, res){
	
	//console.log(req.body.name);
	
	var id = createId(req.body.name);//req.body.email
	var user = exports.findById(id);
	if(user == null)
	{
		//insert new user
		new User({userid: id, email: "no@email.com", name: req.body.name}).save();
	}
	res.send('{"status" : "ok", "id" : "'+id+'"}');
};

exports.deleteUser = function(req, res){
	res.send("respond with a resource");
};

exports.updateUser = function(req, res){
	res.send("respond with a resource");
};

exports.findById = function (id){
	var query = User.find({userid: id});
	query.exec(function (err, res) {
		  if (err) { throw err; }
		  else
		  {
			  if(res.length > 0)
				  return res[0];
			  else
				  return null;
		  }
	});
};

function createId(email){
	return crypto.createHash('md5').update(email).digest('hex');
}