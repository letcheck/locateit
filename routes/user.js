
/*
 * GET users listing.
 */
var User = require('../models/userModel.js');
var crypto = require('crypto');

exports.list = function(req, res){
  	//res.send("respond with a resource");
  	if(req.query.id != null && req.query.id != "undefined")
  	{
  		exports.findByMongoId(req.query.id, function (user){
  			if(user != null)
			{console.log('{"status" : "ok", "data": '+user+'}');
  				res.send('{"status" : "ok", "data": '+user+'}');
			}
  			else
  				res.send('{"status" : "ko", "msg" : "an internal error occur Error 418"}');
  		});
  	}
  	else
  		res.send('{"status" : "ko", "msg" : "No id of user given"}');
  	
};

exports.add = function(req, res){
	
	//console.log(req.body.name);
	
	var id = createId(req.body.name);//req.body.email
	var user = exports.findById(id, function(user){
		if(user == null)
		{
			//insert new user
			new User({userid: id, email: "no@email.com", name: req.body.name}).save();
		}
		res.send('{"status" : "ok", "id" : "'+id+'"}');
	});
	
};

exports.deleteUser = function(req, res){
	res.send("respond with a resource");
};

exports.updateUser = function(req, res){
	res.send("respond with a resource");
};

exports.findById = function (id, fct){
	var query = User.find({userid: ""+id});
	query.exec(function (err, res) {
		  if (err) { throw err; }
		  else
		  {console.log(res.length);console.log(res[0]);
			  if(res.length > 0)
				  fct( res[0]);
			  else
				  fct(null);
		  }
	});
};

exports.findByMongoId = function (id, fct){
	var query = User.find({ _id: id});
	query.exec(function (err, res) {
		  if (err) { throw err; }
		  else
		  {
			  if(res.length > 0)
				  fct( res[0]);
			  else
				  fct(null);
		  }
	});
};

function createId(email){
	return crypto.createHash('md5').update(email).digest('hex');
}