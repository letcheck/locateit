// The content model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var Media = require('../models/mediaModel.js');
var Comment = require('../models/commentModel.js');
var User = require('../models/userModel.js');

//var contentSchema = new Schema({txt: String, userId: String, date: Date});
var contentSchema = new Schema({
msg: String,
latitude: Number,
longitude: Number,
postdate: {type: Date, default: Date.now},
rating: {type: Number, default: 1},
media: [Media.mediaSchema],
comment: [Comment.commentSchema],
user: {type: Schema.Types.ObjectId, ref: 'User'}
});
 
module.exports = mongoose.model('Content', contentSchema);
