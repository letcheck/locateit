// The comment model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var User = require('../models/userModel.js');

var commentSchema = new Schema({
msg: String,
postdate: {type: Date, default: Date.now},
user: {type: Schema.Types.ObjectId, ref: 'User'}
});
 
module.exports = mongoose.model('Comment', commentSchema);
