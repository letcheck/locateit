var map;
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
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
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
google.maps.event.addDomListener(window, 'load', initialize);

/**
 * to have a nice file input which look like boostrap
 */
$(document)
.on('change', '.btn-file :file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
    $("#showfile").val(label);
});