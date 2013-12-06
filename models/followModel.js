// The follow model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var followedPlaceSchema = new Schema({
userid: {type: String, ref: 'User'},
lat: Number,
long: Number,
rLatmin: Number,
rLatmax: Number,
rLngmin: Number,
rLngmax: Number
});
 
module.exports = mongoose.model('Follow', followedPlaceSchema);