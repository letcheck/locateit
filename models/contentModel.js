// The content model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var Media = require('../models/mediaModel.js');

//var contentSchema = new Schema({txt: String, userId: String, date: Date});
var contentSchema = new Schema({
msg: String,
latitude: Number,
longitude: Number,
postdate: {type: Date, default: Date.now},
rating: {type: Number, default: 1},
media: [Media.mediaSchema],
comment: [contentSchema]    
});
 
module.exports = mongoose.model('Content', contentSchema);
