/*
 * REST api for the follow, the function :
 * - 
 */
var Follow = require('../models/followModel.js');
var Notification = require('../models/notificationModel.js');
var Content = require('./content.js');

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
		var lat1tokm = 111.11;
		var radius = parseFloat(req.body.radius);
		var lat = parseFloat(req.body.lat);
		var lng = parseFloat(req.body.long);
		var rlat = radius/lat1tokm;
		var rlng = radius/(lat1tokm * Math.cos(lat));
		
		var rlatmin = lat - rlat;
		var rlatmax = lat + rlat;
		var rlngmin = lng - rlng;
		var rlngmax = lng + rlng;
		
		if(rlngmin > rlngmax){
			var tmp = rlngmin;
			rlngmin = rlngmax;
			rlngmax = tmp;
		}
		
		new Follow({userid: req.body.userid,lat: lat, long: lng, rLatmin: rlatmin, rLatmax: rlatmax, rLngmin: rlngmin, rLngmax: rlngmax}).save(function (err) {
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
	if(req.params.iduser)
	{
		var query = Notification.find({userid: ""+req.params.iduser});
		if(req.params.nb)
			query.limit(parseInt(req.params.nb));
		if(req.params.start)
			query.skip(parseInt(req.params.start));
		if(req.params.date)
			query.where("date").gte(req.params.date);
		query.sort({date: -1}).exec(function (err, resquery) {
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

exports.readNotification = function(req,res){
	if(req.params.iduser)
	{
		if(req.params.idnotification)
		{
			var where = {userid: ""+req.params.iduser, _id : req.params.idnotification};
			var setmap = {read : true};
			
			var query = Notification.update(where, setmap, function(err){
				if(err)
					res.send('{"status" : "ko", "msg" : "An internal error occur"}');
				else
					res.send('{"status" : "ok", "msg" : "Notification updated"}');
			});
			query.exec();
		}
	}
	else
		res.send('{"status" : "ko", "msg" : "No id of user given"}');
};

exports.notify = function (map, id){
	
	var lat = map.latitude;
	var long = map.longitude;
	var query = Follow.find();
	
	query.where("rLatmin").lte(lat);
	query.where("rLatmax").gte(lat);
		
	/*if(long > 0)
	{*/
		query.where("rLngmin").lte(long);
		query.where("rLngmax").gte(long);
	/*}
	else
	{
		query.where("rLngmin").gte(long);
		query.where("rLngmax").lte(long);
	}*/
	
	query.find(function(err, resquery){
		if(err){console.log("erreur "+err);}
		else
		{
			for(var i = 0; i < resquery.length; i++)
			{
				new Notification({userid : resquery[i].userid, content: id, read: false, followid: resquery[i]._id}).save();
			}
		}
	});
};
