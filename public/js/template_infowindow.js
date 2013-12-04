/*
 * the different template for the info windows
 */
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var template_text = '<div id=info_window>'+
	'<div>'+
	'<blockquote>'+
	'<p>{0}</p>'+
	'<small>by {3} the {2}</small>'+
	'</blockquote>'+
	'</div><div style="text-align:center;">'+
	'<img src="{1}" style="max-width: 600px;max-height:200px;"/></div>'+
	'</div>';

var template_video = '<div id=info_window>'+
'<div>'+
'<blockquote>'+
'<p>{0}</p>'+
'<small>by {3} the {2}</small>'+
'</blockquote>'+
'</div><div style="text-align:center;">'+
'<iframe width="560" height="315" src="//www.youtube.com/embed/{1}?rel=0" frameborder="0" allowfullscreen></iframe></div>'+
'</div>';