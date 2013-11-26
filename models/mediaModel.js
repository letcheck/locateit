// The content model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var mediaSchema = new Schema({type: String, url: String});

module.exports = mongoose.model('Media', mediaSchema);