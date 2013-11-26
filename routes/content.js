/*
 * REST api for the media content, the function :
 * - addMedia
 */
var Content = require('../models/contentModel.js');
var Media = require('../models/mediaModel.js');


exports.index = function(req, res){
  res.send("{Status : 'ok', Msg : 'Server running'}");
};

exports.addMedia = function(req, res){
	console.log('addMedia '+req.params.msg);
	res.send("{Status : 'ok', Msg : 'Content added'}");
	var mediaH = new Media({type: "img", url: "http://127.0.0.1:5000/img/aurore.jpeg"});
	new Content({msg: req.params.msg, latitude : req.params.lat, longitude : req.params.long, media: mediaH,
		comment:{}}).save();
};

exports.getMedia = function(req, res){
	Content.find(function(err, contents){
		if(!err)
			res.send(contents);
		else
			res.send('[{"Status" : "error", "msg" : "can find any media"}]');
	});
};