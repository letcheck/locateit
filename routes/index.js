
/*
 * GET home page.
 */

exports.index = function(req, res){

	res.render('index', { title: 'Locate It', login: req.session.login, page : "home", userid:req.session.userid });
};

exports.api = function(req, res){
	res.render('api', {title : 'Locate It API', login: req.session.login , page : ""});
};


