// The notification model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var User = require('../models/userModel.js');
var Content = require('../models/contentModel.js');

var notificationSchema = new Schema({
userid: {type: String, ref: 'User'},
content: {type: Schema.Types.ObjectId, ref: 'Content'},
date : {type: Date, default: Date.now},
read : Boolean
});
 
module.exports = mongoose.model('Notification', notificationSchema);