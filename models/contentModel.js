// The content model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
 
var contentSchema = new Schema({
msg: String,
latitude: Number,
longitude: Number,
postdate: {type: Date, default: Date.now}
});
 
module.exports = mongoose.model('Content', contentSchema);