// The user model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var userSchema = new Schema({
userid: String,
email: String,
name: String,
from: {type: String, default: "google"}
});
 
module.exports = mongoose.model('User', userSchema);