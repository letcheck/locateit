/*
 * GET users listing.
 */

exports.poststh = function(req, res){
  res.render('post', { title: 'Locate It', login: req.session.login, page : "post", iduser : req.session.id });
};