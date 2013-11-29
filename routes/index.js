
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Locate It' });
};

exports.api = function(req, res){
	res.render('api', {title : 'Locate It API'});
}