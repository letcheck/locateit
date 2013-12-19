/*
 * all the js code for the page handling the follow places
 */
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

/*
 * Add a marker to the map and push to the array.
 */
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

/*
 * geolocate the browser
 */
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

/*
 * call the reversegeocoding google map api and center the map on that place
 */
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
	markFollowedPlaces();
});

/*
 * ajax request to put a follow place
 */
function follow(){
	if(marker != null && $("#radius").val() > 0) {
		$.ajax({
			type: "POST",
			url: api_server_address+"/follow",
			dataType: 'json',
			data: {userid: userid, lat: marker.getPosition().lat(), long: marker.getPosition().lng(), radius: circle.radius/1000}
			}).done(function(data)
			{
				location.reload(); 
			});
	}
}

/*
 * change the radius view on the map
 */
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

function getWindowContent(id){
	return '<button class="btn btn-primary" type="button" onclick="unfollow(\'' + id + '\')">unfollow</button>';
}

/*
 * ajax request to get all the follow place and put them on the map
 */
function markFollowedPlaces(){
	$.ajax({
		type: "GET",
		url: api_server_address+"/follow/all/"+userid+"/10000/0/prout",
		dataType: 'json',
		}).done(function(data)
		{
			$.each(data.data, function(){
				console.log(this._id);
				var radius = (this.lat - this.rLatmin) * 111110;
				var cmarker = new google.maps.Marker({
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
					position: new google.maps.LatLng(this.lat, this.long),
					map: map
				});
				var circle = new google.maps.Circle({
				  map: map,
				  fillColor: '#AAA000',
				  radius: radius,
				  clickable: false
				});
				circle.bindTo('center', cmarker, 'position');
				var infowindow = new google.maps.InfoWindow({
				  content: getWindowContent(this._id)
				});
				google.maps.event.addListener(cmarker, 'click', function() {
					infowindow.open(map,cmarker);
				});
			});		
		});
}

/*
 * ajax request to unfollow a place
 */
function unfollow(id){
	$.ajax({
		type: 'DELETE',
		url: api_server_address+"/follow/"+userid+"/"+id
		}).done(function(data)
		{
			location.reload(); 
		});
}