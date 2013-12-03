/*
 * GET users listing.
 */

exports.poststh = function(req, res){console.log(req.session);
  res.render('post', { title: 'Locate It', login: req.session.login, page : "post", userid : req.session.userid });
};