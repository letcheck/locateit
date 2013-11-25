
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
    
    addMarkers();
}

function addMarkers()
{
	var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var marker = new google.maps.Marker({
	      position: myLatlng,
	      map: map,
	      title: 'Hello World!'
	  });
	$.ajax({
		type: "GET",
		url: "http://127.0.0.1:5000/media/10",
		dataType: 'html',
		}).done(function(data)
			{alert(""+data);
				var mediaList = $.parseJSON( data );
				$.each(mediaList, function(){
					addMarker(this.latitude, this.longitude);
				});		
			});
}

function addMarker( lat, long)
{
	var latLong = new google.maps.LatLng(lat,long);
	var marker = new google.maps.Marker({
	      position: latLong,
	      map: map,
	      title: 'Hello World!'
	  });
}
google.maps.event.addDomListener(window, 'load', initialize);