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
   
    // Try HTML5 geolocation
    if(navigator.geolocation) 
    {
      navigator.geolocation.getCurrentPosition(function(position) 
    		  {
		        var pos = new google.maps.LatLng(position.coords.latitude,
		                                         position.coords.longitude);
		        
		        map.setCenter(pos);
		      }, function() {
		        handleNoGeolocation(true);
		      });
    } 
    else 
    {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
      
    }
    
    addMarkers();
}

/*
 * add marker showing the place of the different media 
 */
function addMarkers()
{
	var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var marker = new google.maps.Marker({
	      position: myLatlng,
	      map: map
	  });
	$.ajax({
		type: "GET",
		url: "http://127.0.0.1:5000/media/10",
		dataType: 'html',
		}).done(function(data)
			{
				var mediaList = $.parseJSON( data );
				$.each(mediaList, function(){
					addMarker(this.latitude, this.longitude, this);
				});		
			});
}

/*
 * add one marker to the given lat and long
 */
function addMarker( lat, long, data)
{
	var latLong = new google.maps.LatLng(lat,long);
	var marker = new google.maps.Marker({
	      position: latLong,
	      map: map
	  });
	var imgurl = data.media[0].url;
	var infowindow = new google.maps.InfoWindow({
	      content: template_video.format(data.msg,imgurl),
	      maxWidth: 600
	  });
	google.maps.event.addListener(marker, 'click', function() {
		onlyOneInfoWindow(marker, infowindow);
	    infowindow.open(map,marker);
	  });

}

function onlyOneInfoWindow(marker, infowindow)
{
	if(openmarker != null && openmarker != marker)
	{
		infowindowopen.close();
	}
	openmarker = marker;
	infowindowopen = infowindow;
}
//load the map
google.maps.event.addDomListener(window, 'load', initialize);