/*
 * Map.js 
 * all the function for the map
 */

var map;
var openmarker = null;
var infowindowopen = null;
/*
 * handle the fact that the browser do not support geolocation
 */
function handleNoGeolocation(errorFlag) {
	var content;
    if (errorFlag) {
    	 content = 'Error: The Geolocation service failed.';
    } else {
    	content = 'Error: Your browser doesn\'t support geolocation.';
    }
    console.log(content);
    var options = {
      map: map,
      position: new google.maps.LatLng(10, 0),
      content: content
    };

    /*var infowindow = new google.maps.InfoWindow(options);*/
    map.setCenter(options.position);
}

/*
 * create the map
 */
function initialize() {
	
    var mapOptions = {
      center: new google.maps.LatLng(10, 0),
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    resizeMap();
    addMarkers();
}

/*
 * add marker showing the place of the different media 
 */
function addMarkers()
{
	/*var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var marker = new google.maps.Marker({
	      position: myLatlng,
	      map: map
	  });*/
	$.ajax({
		type: "GET",
		url: api_server_address+"/media/10",
		dataType: 'html',
		}).done(function(data)
			{
				var mediaList = $.parseJSON( data );
				$.each(mediaList, function(){
					var media = this;
					requestUser(this.user, function(name){
						addMarker(media.latitude, media.longitude, media, name);
					});
				});		
			});
}

function requestUser(id, callback)
{
	$.ajax({
		type: "GET",
		url: api_server_address+"/users?id="+id,
		dataType: 'json',
		}).done(function(data)
			{
				//var data = $.parseJSON( data );alert(id+" "+data);
				if(data.status == "ok")
				{alert(data.data.name);
					callback(data.data.name);
				}
				else{
					callback("Anonyme");
				}
			});
}

/*
 * add one marker to the given lat and long
 */
function addMarker( lat, long, data, name)
{
	var latLong = new google.maps.LatLng(lat,long);
	var marker = new google.maps.Marker({
	      position: latLong,
	      map: map
	  });
	var imgurl = data.media[0].url;
	var date = new Date(data.postdate);
	var dateStr = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
	
	var infowindow;
	if(data.media[0].type =='img')
	{
		infowindow = new google.maps.InfoWindow({
	      content: template_text.format(data.msg,imgurl, dateStr, name),
	      maxWidth: 600
		});
	}
	else
	{
		infowindow = new google.maps.InfoWindow({
		      content: template_video.format(data.msg,imgurl, dateStr, name),
		      maxWidth: 600
			});
	}
	google.maps.event.addListener(marker, 'click', function() {
		var pos = new google.maps.LatLng(lat, long);

		map.setCenter(pos);
		if(infowindowopen != infowindow)
			infowindow.open(map,marker);
		onlyOneInfoWindow(marker, infowindow);
	  });

}

function onlyOneInfoWindow(marker, infowindow)
{
	if(openmarker != null )
	{
		infowindowopen.close();
	}
	if(infowindow != infowindowopen)
	{
		openmarker = marker;
		infowindowopen = infowindow;
	}
	else
	{
		openmarker = null;
		infowindowopen = null;
	}
}
//load the map
google.maps.event.addDomListener(window, 'load', initialize);

window.addEventListener('resize', resizeMap, false);

function resizeMap()
{
	var sizeMap = window.innerHeight-50;
	sizeMap = (sizeMap > 900)? 900 : sizeMap;
	sizeMap = (sizeMap < 100)? 100 : sizeMap;
    $("#map-canvas").css("height", sizeMap);
}