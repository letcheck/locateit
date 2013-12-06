// The follow model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var followedPlaceSchema = new Schema({
userid: {type: String, ref: 'User'},
lat: Number,
long: Number,
radius: Number
});
 
module.exports = mongoose.model('Follow', followedPlaceSchema);