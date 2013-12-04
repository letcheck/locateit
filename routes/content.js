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
				var date = ISODate(req.body.date);
				map["postdate"] = date;
			}
			res.send('{"status" : "ok", "msg" : "Content added"}');	
			new Content(map).save();
		}
	});
	
	
	
	//console.log((req.body.urlvideo == ""));
	
};

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

exports.getMedia = function(req, res){//req.query pour les chaine de get
	Content.find(function(err, contents){
		if(!err)
			res.send(contents);
		else
			res.send('[{"status" : "error", "msg" : "can find any media"}]');
	});
};
exports.deleteMedia = function(req,res){
	
};

exports.addComment = function(req,res){
	
};

exports.getComment = function(req,res){
	
};

exports.deleteComment = function(req,res){
	
};