/*
 * REST api for the media content, the function :
 * - addMedia
 */
var Content = require('../models/contentModel.js');


exports.index = function(req, res){
  res.send("{Status : 'ok', Msg : 'Server running'}");
};

exports.addMedia = function(req, res){
	console.log('addMedia '+req.params.msg);
	res.send("{Status : 'ok', Msg : 'Content added'}");
	new Content({msg: req.params.msg, latitude : req.params.lat, longitude : req.params.long}).save();
};

exports.getMedia = function(req, res){
	Content.find(function(err, contents){
		if(!err)
			res.send(contents);
		else
			res.send('[{"Status" : "error", "msg" : "can find any media"}]');
	});
};