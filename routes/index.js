
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Locate It', login: req.session.login });
};