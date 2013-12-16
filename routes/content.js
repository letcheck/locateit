/*
 * REST api for the media content, the function :
 * - addMedia
 */
var Content = require('../models/contentModel.js');
var Media = require('../models/mediaModel.js');
var String = require('../utils/string.js');
var fs = require('fs');
var crypto = require('crypto');
var serverAddress = "http://127.0.0.1:5000/";
var userfct = require("./user.js");
var followfct = require("./follow.js");

exports.index = function(req, res){
  res.send("{status : 'ok', msg : 'Server running'}");
};

exports.addMedia = function(req, res){

	var mediaH;
	if(req.body.urlpicture != "" && String.validateUrl(req.body.urlpicture))
		mediaH = new Media({type: "img", url: req.body.urlpicture});
	else if(req.body.urlvideo != "" && String.validateUrl(req.body.urlvideo))
	{
		var match = String.catchYoutubeUrl(req.body.urlvideo);
		if(match == null)
		{
			res.send('{"status" : "ko", "msg" : "Not a Youtube url"}');
			return;
		}
		mediaH = new Media({type: "video", url: match});
	}
	else
	{
		res.send('{"status" : "ko", "msg" : "You have to provide a media"}');
		return;
	}
	
	userfct.findById(req.body.userid, function (userinfo){
		if(userinfo == null)
		{
			res.send('{"status" : "ko", "msg" : "You are not an authentified user, please contact the administrator"}');
			return;
		}
		else
		{
			var map = {msg: req.body.msg, latitude : req.body.lat, longitude : req.body.long, media: mediaH,
					comment:{}, user: userinfo._id};
			if(req.body.date)
			{
				/*var d = req.body.date.split("-");
				var date = new Date(d[0], d[1], d[2]).toISOString();*/
				map["postdate"] = createIsoDate(req.body.date);
			}
			res.send('{"status" : "ok", "msg" : "Content added"}');	
			new Content(map).save(function(err, doc){
				followfct.notify(map, doc._id);
			});
			
		}
	});
	
	
	
	//console.log((req.body.urlvideo == ""));
	
};

/*
 * create an isodate base on a YYYY-MM-DD date
 */
function createIsoDate(dt)
{
	var d = dt.split("-");
	var date = new Date(d[0], d[1], d[2]).toISOString();
	return date;
}

/*
 * add a picture to the img folder and send back the url
 */
exports.addPicture = function(req, res){
	var type = req.files.pictureToUpload.type;console.log(req.files.pictureToUpload.name);
	if(type != 'image/png' && type != 'image/jpg' && type != 'image/gif' && type != 'image/jpeg')
	{
		res.send('{"status" : "ko", "msg" : "this is not a gif or png or jpg"}');
	}
	else if(req.files.pictureToUpload.size > 5000000)//5 MO
	{
		res.send('{"status" : "ko", "msg" : "The file is to big, the file have to be under 5MO"}');
	}
	else
	{
		
		fs.readFile(req.files.pictureToUpload.path, function (err, data) {
				var name = crypto.createHash('md5').update(req.files.pictureToUpload.name).digest('hex');
				var newPath =  __dirname+"/../public/img/"+name;
				  
				fs.writeFile(newPath, data, function (err) {
					  var url = serverAddress + "img/"+req.files.pictureToUpload.name;
					  if(!err)
						  res.send('{"status" : "ok", "url" : "'+url+'"}');
					  else
					  {
						  res.send('{"status" : "ko", "msg" : "An internal error occur, error 418 "}');
						  console.log(err);
					  }
						  
				});
		});
	}
};

exports.getMedia = function(req, res, next){//req.query pour les chaine de get
	if(!req.params.number)
	{
		res.send('{"status" : "ko", "msg" : "not enough data given, check the api"}');
		return;
	}
	
	if(req.params.number == "one")//we go to getOneMedia
		next();
	
	var query = Content.find();
	query.limit(parseInt(req.params.number));
	if(req.query.start)
		query.skip(parseInt(req.query.start));
	if(req.query.begin)
		query.where("postdate").gte(createIsoDate(req.query.begin));
	if(req.query.end)
		query.where("postdate").lte(createIsoDate(req.query.end));
	if(req.query.latmin)
		query.where("latitude").gte(parseFloat(req.query.latmin));
	if(req.query.latmax)
		query.where("latitude").lte(parseFloat(req.query.latmax));
	if(req.query.longmin)
		query.where("longitude").gte(parseFloat(req.query.longmin));
	if(req.query.longmax)
		query.where("longitude").lte(parseFloat(req.query.longmax));
	
	query.sort("-rating");
	query.exec(function(err, contents){
		if(!err)
		{
			res.send(contents);
		}
		else
			res.send('{"status" : "ko", "msg" : "can find any media"}');
	});
};

exports.getOneMedia = function(req, res){
	var query = Content.find({_id: ""+req.query.id});
	query.exec(function (err, result) {
		  if (err) { console.log(err); res.send('{"status" : "ko", "msg" : "an internal error occur"}');}
		  else
		  {
			  var map = {status : "ok", data : result};
			  var json = JSON.stringify(map, null, 4);
			  try{
				  res.send(json);
			  }catch(e){
				  console.log(e);
			  }
		  }
	});
};

exports.rate = function(req,res)
{
	if(req.body.rate && req.body.id)
	{
		var query = Content.find({_id: ""+req.query.id});
		query.exec(function(err, result){
			if(!err)
			{
				var where = {_id: ""+req.body.id};
				var val = (req.body.rate)? 1 : -1;
				var setmap = {rating: result[0].rating+val};
				User.update(where, setmap, function(err){
					if(!err)
						res.send('{"status" : "ok", "msg" : "rating updated"}');
				});
			}
		});
	}
	else
		res.send('{"status" : "ko", "msg" : "not enough data"}');
};

exports.deleteMedia = function(req,res){
	
};

exports.addComment = function(req,res){
	
};

exports.getComment = function(req,res){
	
};

exports.deleteComment = function(req,res){
	
};