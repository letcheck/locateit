var map;
var geocoder;
var marker = null;
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
	      marker = new google.maps.Marker({
	          map: map,
	          position: results[0].geometry.location
	      });

	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	  map.setZoom(8);
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

$(document).ready(function(){
	checkRadioChange();
	$("#gothere").click(function(){codeAddress(); $("#locatetome").attr('checked', false);});
	$("#locatetome").click(function(){
		if($(this).is(":checked"))
			locate();
	});
	$("#submit").click(function(){
		checkAndSend();
	});
	$("#error").hide();
});


function checkAndSend()
{
	$("#error").hide();
	if(marker == null)
		error("You must provide a location for your media! Please click on the map where you want to add your media");
	else if(!$("#picture").val() && !$("#showfile").val() && !$("#video").val())
		error("You must provide a media content! A picture via url, via upload or a youtube link");
	else
	{
		/*$.ajax({
			type: "POST",
			url: api_server_address+"/media",
			dataType: 'html',
			data: {msg : $("#msg").val(), lat: marker.position.latitude, long: marker.position.longitude, date: $("#date").val(), urlpicture: $("#picture").val(), urlvideo: $("#video").val()}
			}).done(function(data)
				{
					var mediaList = $.parseJSON( data );
					$.each(mediaList, function(){
						addMarker(this.latitude, this.longitude, this);
					});		
				});*/
		alert($("#msg").val()+" "+marker.getPosition.lat()+" "+marker.getPosition.lng()+" "+$("#date").val()+" "+$("#picture").val()+" "+$("#video").val());
	}
}

function error(msg)
{
	$("#error").show();
	$("#error").text(msg);
}
function checkRadioChange () {
	$("#videoUp").hide();
	$("input[name='typemedia']").change(function(){
		if($("input[name='typemedia']:checked").val() == 'picture')
		{
			$("#videoUp").hide();
			$("#pictureUp").show();
		}
		else
		{
			$("#videoUp").show();
			$("#pictureUp").hide();
		}
	});
}