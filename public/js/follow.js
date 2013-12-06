var map;
var geocoder;
var marker = null;
var userid = "";
var circle = null;

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
	geocoder = new google.maps.Geocoder();

    var mapOptions = {
      center: new google.maps.LatLng(10, 0),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
   locate();
   
   google.maps.event.addListener(map, 'click', function(event) {
	    addMarker(event.latLng);
	  });

}

//Add a marker to the map and push to the array.
function addMarker(location) {
	if(marker == null)
	{
		marker = new google.maps.Marker({
		    position: location,
		    map: map
		});
	}
	else
		marker.setPosition(location);
}


function locate()
{
	// Try HTML5 geolocation
   if(navigator.geolocation) 
    {
      navigator.geolocation.getCurrentPosition(function(position) 
    		  {
		        var pos = new google.maps.LatLng(position.coords.latitude,
		                                         position.coords.longitude);
		        
		        map.setCenter(pos);
				addMarker(pos);
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

function codeAddress() {
	  var address = document.getElementById('address').value;
	  geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			if(marker == null) {
			  marker = new google.maps.Marker({
				  map: map,
				  position: results[0].geometry.location
			  });
			}
			else {
				marker.setPosition(results[0].geometry.location);
			}
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	  map.setZoom(8);
}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function(){
	$("#gothere").click(codeAddress);
	$("#locateme").click(locate);
	$("#radiusButton").click(changeRadius);
	$("#follow").click(follow);
	userid = $("#userid").text();
});

function follow(){
	if(marker != null && $("#radius").val() > 0) {
		$.ajax({
			type: "POST",
			url: api_server_address+"/follow",
			dataType: 'json',
			data: {userid: userid, lat: marker.getPosition().lat(), long: marker.getPosition().lng(), radius: $("#radius").val()}
			})
	}
}

function changeRadius() {
	if(marker != null) {
		if(circle == null) {
			circle = new google.maps.Circle({
			  map: map,
			  fillColor: '#AA0000',
			  radius: 0,
			  clickable: false
			});
			circle.bindTo('center', marker, 'position');
		}
		circle.setRadius($("#radius").val()*1000);
	}
}