
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
			{
				var map = {status : "ok", data : user};
				var json = JSON.stringify(map, null, 4);
  				res.send(json);
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
	
	var id = createId(req.body.email);//req.body.email
	res.send('{"status" : "ok", "id" : "'+id+'"}');
	var user = exports.findById(id, function(user){
		
		if(user == null)
		{
			//insert new user
			new User({userid: id, email: req.body.email, name: req.body.name, sendMail: req.body.sendMail}).save();
		}
		
	});
	
};

exports.deleteUser = function(req, res){
	res.send("respond with a resource");
};

exports.updateUser = function(req, res){
	var iduser = req.params.iduser;
	if(iduser != null && iduser != "undefined")
  	{
		var where = {userid: ""+iduser};
		var setmap = {};
		if(req.body.name)
			setmap["name"] = req.body.name;
		if(req.body.sendMail != null)
		{
			if(req.body.sendMail == "true")
				setmap["sendMail"] = true;
			else
				setmap["sendMail"] = false;
		}
		var query = User.update(where, setmap, function(err){
			if(err)
				res.send('{"status" : "ko", "msg" : "An internal error occur"}');
			else
				res.send('{"status" : "ok", "msg" : "User updated"}');
		});
  	}
	else
		res.send('{"status" : "ko", "msg" : "No id of user given"}');
};

exports.findById = function (id, fct){
	var query = User.find({userid: ""+id});
	query.exec(function (err, res) {
		  if (err) { throw err; }
		  else
		  {//console.log(res.length);console.log(res[0]);
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