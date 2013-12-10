var showSidebar = false;
var sidebarHtmltop = '<div class="sidebar">'+
	'<div class="list-group">'+
		'<a class="list-group-item active" href="#">Places</a>';

var sidebarCenter = '<a class="list-group-item" href="#" onClick="printFollowOnMap();">{0}</a>';
var sidebarBottom1 = '</div><div class="list-group"><a class="list-group-item active" href="#">Notifications</a>';
var sidebarCenter2 = '<a class="list-group-item" href="#" onClick="showNotification()">{0}</a>';
var sidebarHtmlBottom2 = 		'</div>'+
							'</div>';
var userid = "";
var geocoder = null;
var follow;
var notifications;

var toggleSidebar = function()
{
	if(geocoder == null)
		geocoder = new google.maps.Geocoder();

	userid = $("#userid").text();
	//console.log("coucou");
	var body = document.getElementById('body');
	var content = document.getElementById('content');
	showSidebar = !showSidebar;
	if (showSidebar) {
		getData(function(follows, nots){
			var div = document.createElement('div');
			div.class = 'sidebar';
			div.id ='sidebar';
			follow = follows;
			notifications = nots;
			parseCenter(follows, nots, function(center, center2){
				var html = sidebarHtmltop + center + sidebarBottom1+ center2+ sidebarHtmlBottom2;
				div.innerHTML = html;
				body.insertBefore(div, content);
			});
			
			content.setAttribute('class', 'container page-content');
		});
		
		$("#notification").addClass('active');
	}
	else {
		var sidebar = document.getElementById('sidebar');
		body.removeChild(sidebar);
		content.setAttribute('class', 'container');
		$("#notification").removeClass('active');
	}
	
};

function getData(callback)
{
	$.ajax({
		type: "GET",
		url: api_server_address+"/follow/all/"+userid,
		dataType: 'html',
		}).done(function(data)
			{
				var list = $.parseJSON( data );
				if(list.data.length > 0)//if we have some follow we may have some notifications
				{
					$.ajax({
						type: "GET",
						url: api_server_address+"/follow/notification/"+userid+"/"+10,
						dataType: 'html',
						}).done(function(rep){
							var listNot = $.parseJSON( rep );
							callback(list.data, listNot.data);
						});
				}
				
					
			});
}

function parseCenter(data, nots, callback)
{
	if(data != null && data.length > 0)
	{
		var center = "";
		count = data.length;
		$.each(data, function(){
			inverseGeocoding(parseFloat(this.lat), parseFloat(this.long), function(name){
				center += sidebarCenter.format(name);
				count--;
				if(count == 0)
					parseNot(nots, function(center2){
						callback(center, center2);
					});
					//callback(center);
			});
			//center += sidebarCenter.format(data)
		});
	}
	else
		callback("","");
}

function parseNot(data, callback)
{
	if(data != null && data.length > 0)
	{
		var center = "";
		count = data.length;
		$.each(data, function(){
			var currentId = this.content;
			getSummary(this.content, function(text){
				center += ('<a class="list-group-item" href="#" onClick="showNotification(\''+currentId+'\')">{0}</a>').format(text);
				count--;
				if(count == 0)
					callback(center);
			});
		});
	}
	else
		callback("","");
}

function getSummary(id, callback)
{
	$.ajax({
		type: "GET",
		url: api_server_address+"/media/one?id="+id,
		dataType: 'html',
		}).done(function(data)
			{
				var d = $.parseJSON( data );
				var shortText;
				if(d.data[0].msg)
				{
					shortText = jQuery.trim(d.data[0].msg).substring(0, 50);
					if(d.data[0].msg.length > 50)
						shortText = shortText.split(" ").slice(0, -1).join(" ") + "...";
				}
				else
					shortText = "";
				callback(shortText);
			});
	
}
function inverseGeocoding(lat, long , callback)
{
	var latlng = new google.maps.LatLng(lat, long);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	    	  callback(results[1].address_components[2].long_name);
	      	}
	    }
	});
}

function showNotification(id)
{
	google.maps.event.trigger(markers[id], 'click');
}

/*
 * print all the notification link to the place we click
 */
function printFollowOnMap()
{
}