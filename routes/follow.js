/*
 * REST api for the follow, the function :
 * - 
 */
var Follow = require('../models/followModel.js');

exports.getFollow = function(req,res){
	if(req.params.iduser)
	{
		var query = Follow.find({userid: ""+req.params.iduser});
		if(req.params.nb)
			query.limit(parseInt(req.params.nb));
		if(req.params.start)
			query.skip(parseInt(req.params.start));
		query.exec(function (err, resquery) {
		  if (err) { throw err; }
		  else
			 {
			  	var map = {status : "ok", data : resquery};
				var json = JSON.stringify(map, null, 4);
				res.send(json);
			 }
		});
	}
	else
		res.send('{"status" : "ko", "msg" : "No id of user given"}');
};

exports.getFollowById = function(req,res){
	if(req.params.id)
	{
		var query = Follow.find({_id: req.params.id});
		query.exec(function (err, resquery) {
			  if (err) { throw err; }
			  else
				 {
				  	var map = {status : "ok", data : resquery};
					var json = JSON.stringify(map, null, 4);
					res.send(json);
				 }
			});
	}
	else
		res.send('{"status" : "ko", "msg" : "Missing some data"}');
};

exports.addFollow = function(req,res){
	if( req.body.userid != null && req.body.lat != null && req.body.long != null && req.body.radius != null)
	{
		new Follow({userid: req.body.userid, lat: req.body.lat, long: req.body.long, radius: req.body.radius}).save(function (err) {
			  if (err) { throw err; }
			  else
				  res.send('{"status" : "ok", "msg" : "Follow added"}'); 
		});
		
	}
	else
		res.send('{"status" : "ko", "msg" : "No id given"}');
};

exports.deleteFollow = function(req,res){
	if(req.params.iduser != null && req.params.idfollow != null)
	{
		var query = Follow.find({_id: req.params.idfollow});
		query.exec(function (err, resquery) {
			if(err){throw err;}
			else
			{
				if(resquery[0].userid == req.params.iduser)
				{
					query = Follow.remove({_id: req.params.idfollow});
					query.exec(function (err, resquery) {
						if(err){throw err;}
						else
							res.send('{"status" : "ok", "msg" : "Follow deleted"}');
						});
				}
				else
					res.send('{"status" : "ko", "msg" : "Not the good user"}');
			}
		
		});
	}
	else
		res.send('{"status" : "ko", "msg" : "Missing some data"}');
};


exports.getNotification = function(req,res){
	
}