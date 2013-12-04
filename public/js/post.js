var map;
var geocoder;
var marker = null;
var userid = "";
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
        value = input.val(),
        label = value.replace(/\\/g, '/').replace(/.*\//, '');
    //input.trigger('fileselect', [numFiles, label]);
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
	userid = $("#userid").text();
});

/*
 * check the data to be correct then send the data
 */
function checkAndSend()
{
	$("#error").hide();
	if(marker == null)
		error("You must provide a location for your media! Please click on the map where you want to add your media");
	else if(!$("#picture").val() && !$("#showfile").val() && !$("#video").val())
		error("You must provide a media content! A picture via url, via upload or a youtube link");
	else
	{
		var urlpicture = $("#picture").val();
		var go = true;
		//if the user want to upload a picture
		if($("#showfile").val() && !$("#video").val())
		{
			var file = $(".btn-file :file").prop("files")[0];
	        name = file.name;
	        size = file.size;
	        type = file.type;
	        
	        if(file.size > 5000000) {
	            error("File is to big it have to be under 5MO");
	            go = false;
	        }
	        else if(file.type != 'image/png' && file.type != 'image/jpg' && !file.type != 'image/gif' && file.type != 'image/jpeg' ) {
	            error("File doesnt match png, jpg or gif");
	            go = false;
	        }
	        else
	        {
	        	var formData = new FormData($('#formfile')[0]);
	        	$("#progress-bar").show();
	        	$.ajax({
                    url: api_server_address+"/picture",  //server script to process data
                    type: 'POST',
                    dataType: 'json',
                    xhr: function() {  // custom xhr
                        myXhr = $.ajaxSettings.xhr();
                        if(myXhr.upload){ // if upload property exists
                            myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // progressbar
                        }
                        return myXhr;
                    },
                    //Ajax events
                    success: completeHandler = function(data) {
                        
                        if(data.status == "ok")
                        {
                        	go = true;
                        	urlpicture = data.url;
                        }
                        else
                        {
                        	error(data.msg);
                        	go = false;
                        }
                    },
                    error: errorHandler = function() {
                        error("An error occur during the upload");
                        go = false;
                    },
                    // Form data
                    data: formData,
                    //Options to tell JQuery not to process data or worry about content-type
                    cache: false,
                    contentType: false,
                    processData: false
                }, 'json');
            	
	        }
		}
		
		if(go)
		{
			$.ajax({
				type: "POST",
				url: api_server_address+"/media",
				dataType: 'json',
				data: {msg : $("#msg").val(), lat: marker.getPosition().lat(), long: marker.getPosition().lng(), date: $("#date").val(), urlpicture: urlpicture, urlvideo: $("#video").val(), userid: userid}
				}).done(function(data)
					{
						if(data.status != 'ok')
							error(data.msg);
						else
						{//we clean everything
							$("#video").val("");
							$("#showfile").val("");
							$("#picture").val("");
							//and we go back to the main page
							window.location.href = "/";
						}
					});
		}
	}
}

function progressHandlingFunction(e){
    if(e.lengthComputable){
    	$("#progress").show();
       $('#progress-bar').attr({style: "width:"+e.loaded+"%;"});
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