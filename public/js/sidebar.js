var showSidebar = false;
var sidebarHtmltop = '<div class="sidebar">'+
	'<div class="list-group">'+
		'<a class="list-group-item active" href="#">Notification</a>';

var sidebarCenter = '<a class="list-group-item" href="#" onClick="">{0}</a>';
var sidebarHtmlBottom = 		'</div>'+
							'</div>';
var userid = "";
var geocoder = null;
var follow;

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
		getData(function(data){
			var div = document.createElement('div');
			div.class = 'sidebar';
			div.id ='sidebar';
			follow = data;
			parseCenter(data, function(center){
				var html = sidebarHtmltop + center + sidebarHtmlBottom;
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
				callback(list.data);
					
			});
}

function parseCenter(data, callback)
{
	var center = "";
	count = data.length;
	$.each(data, function(){
		inverseGeocoding(parseFloat(this.lat), parseFloat(this.long), function(name){
			center += sidebarCenter.format(name);
			count--;
			if(count == 0)
				callback(center);
		});
		//center += sidebarCenter.format(data)
	});
	
}

function inverseGeocoding(lat, long , callback)
{
	var latlng = new google.maps.LatLng(lat, long);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	    	  callback(results[1].address_components[2].short_name);
	      	}
	    }
	});
}