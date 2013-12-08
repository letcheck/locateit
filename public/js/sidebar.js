var showSidebar = false;

var toggleSidebar = function()
{
	//console.log("coucou");
	var body = document.getElementById('body');
	var content = document.getElementById('content');
	showSidebar = !showSidebar;
	if (showSidebar) {
		var div = document.createElement('div');
		div.class = 'sidebar';
		div.id ='sidebar';
		div.innerHTML = '<div class="sidebar"><div class="list-group"><a class="list-group-item active" href="#">Notification</a><a class="list-group-item" href="#">Lulea</a><a class="list-group-item" href="#">Rennes</a></div></div>'
		body.insertBefore(div, content);
		content.setAttribute('class', 'container page-content');
		$("#notification").addClass('active');
	}
	else {
		var sidebar = document.getElementById('sidebar');
		body.removeChild(sidebar);
		content.setAttribute('class', 'container');
		$("#notification").removeClass('active');
	}
	
}