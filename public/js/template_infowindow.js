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
	'<p>{0}</p>'+
	'<img src="{1}"/>'+
	'</div>';