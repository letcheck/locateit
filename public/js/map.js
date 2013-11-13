
var map;
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
}
function gofuckyourself()
{
	alert("caca");
}
google.maps.event.addDomListener(window, 'load', initialize);