/*
 * REST api for the media content, the function :
 * - addMedia
 */
var Content = require('../models/contentModel.js');
var Media = require('../models/mediaModel.js');
var fs = require('fs');
var serverAddress = "http://127.0.0.1:5000/";

exports.index = function(req, res){
  res.send("{Status : 'ok', Msg : 'Server running'}");
};

exports.addMedia = function(req, res){
	console.log('addMedia '+req.body.msg);
	/*res.send("{Status : 'ok', Msg : 'Content added'}");
	var mediaH = new Media({type: "img", url: "http://127.0.0.1:5000/img/aurore.jpeg"});
	new Content({msg: req.params.msg, latitude : req.params.lat, longitude : req.params.long, media: mediaH,
		comment:{}}).save();*/
	console.log(req.body.urlpicture);
	res.send('{"Status" : "ok", "Msg" : "Content added"}');
};

/*
 * add a picture to the img folder and send back the url
 */
exports.addPicture = function(req, res){
	var type = req.files.pictureToUpload.type;console.log(req.files.pictureToUpload.name);
	if(type != 'image/png' && type != 'image/jpg' && type != 'image/gif' && type != 'image/jpeg')
	{
		res.send('{"Status" : "ko", "msg" : "this is not a gif or png or jpg"}');console.log("pas png");
	}
	else if(req.files.pictureToUpload.size > 5000000)//5 MO
	{
		res.send('{"Status" : "ko", "msg" : "The file is to big, the file have to be under 5MO"}');
	}
	else
	{
		fs.readFile(req.files.pictureToUpload.path, function (err, data) {
			  var newPath =  __dirname+"/../public/img/"+req.files.pictureToUpload.name;
			  fs.writeFile(newPath, data, function (err) {
				  var url = serverAddress + "img/"+req.files.pictureToUpload.name;
				  if(!err)
					  res.send('{"Status" : "ok", "url" : "'+url+'"}');
				  else
				  {
					  res.send('{"Status" : "ko", "msg" : "An internal error occur, error 418 "}');
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
			res.send('[{"Status" : "error", "msg" : "can find any media"}]');
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