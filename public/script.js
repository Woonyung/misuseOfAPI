/*
Appropriating Interaction Technology
Assignment #2 : misuse of API 

Jan 31st, 2015
woonyungchoi@gmail.com

- added likes maximum
- fixed geocode problem
*/

var mode;
var responseLength = -1;
var currentCircle;

var maxLikes = 100;

// Foursqaure Data
function FoursqaureData(id, name, location, checkin){
	var FS = this;
	FS.id = id;
	FS.name = name;
	FS.location = location;
	FS.checkin = checkin;
	FS.likes = '';

}

//////////////////////// MAPPING COLOR //////////////////
// import rainbowviz js : and create new instance of Rainbow
var rainbow = new Rainbow();
rainbow.setSpectrum('#ffffff','#C0FD5B', '#FEF47F', '#FECD44', '#FF5771');


///////////////////////////////////////////////////////////
////////////////////  Foursquare keys  //////////////////
var CLIENT_ID ='----';
var CLIENT_SECRET ='----';


// array to store our objects
var foursquareArray = [];
var limit = 50; // number of venue that I want to look for maximum: 50
var intent = 'browse';
var radius = 5000;


// function getKeyData(){
// 	// you need URL for this..
// 	var baseURL = 'http://localhost:5000/ajaxRequest';
// 	$.ajax({
// 		url: baseURL,
// 		type: 'GET',
// 		success: function(data){
// 			// console.log(data);
// 		},
// 		error: function(err){
// 			console.log("we have problem in getting Key Data");
// 		}
// 	});
// }


function getFoursquareData(lat, lng, term){
	// empty the array 
	foursquareArray = [];

	var baseURL = "https://api.foursquare.com/v2/venues/search?";
	$.ajax({
		//url: baseURL + lat + "," + lng +'&client_id='+ CLIENT_ID+'&client_secret='+ CLIENT_SECRET+'&v=20141101',
		url: baseURL + 
			'll='+ lat + "," + lng +
			'&intent=' + intent +
			'&query=' + term + 
			'&radius=' + radius + 
			'&limit='+ limit+
			'&client_id='+ CLIENT_ID+'&client_secret='+ CLIENT_SECRET+'&v=20141101',
		// url: '/ajaxRequest',
		type: 'GET',
		dataType: 'jsonp',
		success: function(data){
			bottomPart.innerHTML = "";

			responseLength = data.response.venues.length;
			console.log("RL: " + responseLength);

			console.log(data);

			for ( var i = 0; i < data.response.venues.length; i++){
				if (data.response.venues[i] != null ){
					var tempObject = new FoursqaureData(data.response.venues[i].id,
														data.response.venues[i].name,
														data.response.venues[i].location,
														data.response.venues[i].stats.checkinsCount);
					getLikeData(tempObject);
				}				
			}
	
		},
		error: function(data){
		    console.log(data);
		    console.log("we have problem in getting foursquare data");
		}
  	});
}


function getLikeData(tempObject){
	var id = tempObject.id;

	var baseURL = 'https://api.foursquare.com/v2/venues/';
	$.ajax({
		url: baseURL + id + '/likes?&client_id='+ CLIENT_ID+'&client_secret='+ CLIENT_SECRET+'&v=20141101',
		type: 'GET',
		dataType: 'jsonp',
		success: function(data){

			var myLike = data.response.likes.count;
			//console.log(data.response.likes.count);
			tempObject.likes = data.response.likes.count;
			foursquareArray.push(tempObject);
			//console.log("FS Array: " + foursquareArray.length);

			// if foursqaure array length = response length ( running function is done)
			if (foursquareArray.length == responseLength ){
				mapTheData(foursquareArray);
				console.log("length is equal");
			}

		},
		error: function(err){
			console.log("we have problem in getting Like Data");
		}
	});

}


function mapTheData(foursquareArray){
	// console.log(foursquareArray);
	
	// sorted objects by descending order of like
	var sortedArray = foursquareArray.sort(function(a, b){
		return a.likes-b.likes;
	});

	// looping through sorted array -> and run function by passing each elements of array
	for (var i = 0; i < sortedArray.length; i++){
		// and draw crappy places
		if ( sortedArray[i].likes < maxLikes){ 
			drawVenues(sortedArray[i]);
		}
	}

}

///////////////////////////////////////////////////////////////////
/////////////////////////// LOAD THE MAP //////////////////////////
// draw basic map
var zoom = 14;

L.mapbox.accessToken = '----';
// Create a map in the div #map
var map = L.mapbox.map('map', 'woonyung1.k47gjle3',{ 
	zoomControl: false,
	minZoom:13,
	maxZoom:14
})
.setView([40.73, -74.00], zoom); // default view 
// move the place of zoom control to top right
new L.Control.Zoom({ position: 'topright' }).addTo(map);


// Geo Coding - for current location (input)
function geocodeLocation(address, term){
	// geocode
	bottomPart.innerHTML = "<br><span class='smallTitle'>It's loading</span>";

	var geocoder = L.mapbox.geocoder('mapbox.places-v1'); 
	geocoder.query(address, function(err, data){
		if (data.lbounds) {
		    map.fitBounds(data.lbounds);
		    console.log(data);

		    ///////////////////////// added later  --- ? 
		    // convert into lat/ lng values
			var lat = data.latlng[0];
			var lng = data.latlng[1];
			// REQUEST FOURSQUARE DATA
			getFoursquareData(lat,lng, term);
		    // DRAW CURRENT LOCATION
		    drawCurrentLocation(lat,lng);

		} else if (data.latlng) {
			// convert into lat/ lng values
			var lat = data.latlng[0];
			var lng = data.latlng[1];

		    // REQUEST FOURSQUARE DATA
			getFoursquareData(lat,lng, term);

		    // DRAW CURRENT LOCATION
		    drawCurrentLocation(lat,lng);

		} // end of else if
	}); // end of geocode query function
}

//////// DRAW CURRENT LOCATION
function drawCurrentLocation(lat,lng){
	map.setView([lat, lng], zoom); // set view

	var currentMarker = L.marker([lat, lng], {
    icon: L.mapbox.marker.icon({
	      'marker-color': '#EDE8E4'
	    })
	}).addTo(map)
	.bindPopup("current location");
	// .openPopup();

	// Clear out previous results first
	// (it should be inside of function scope) 
	function deleteCircles(myid){
		console.log("function is running");
		map.removeLayer(myid);
		return false;
	}

	$("#searchButton").on("click", function(){
		map.removeLayer(currentMarker);
	});

}


//////// DRAW VENUES NEAR ME ////////
function drawVenues(crappyVenue){
	var address, city;
	// console.log(crappyVenue);
	// console.log(crappyVenue.likes);
	
	var lat = crappyVenue.location.lat;
	var lng = crappyVenue.location.lng;

	// see check if it does not have address
	if (crappyVenue.location.address == undefined) {
		address = ' - - - ';
	} else {
		address = crappyVenue.location.address;
	}
	// see check if it does not have city name
	if (crappyVenue.location.city == undefined) {
		city = ' - - - ';
	} else {
		city = crappyVenue.location.city;
	}

	/////////////////// MAPPING COLOR //////////////////
	// set range 
	rainbow.setNumberRange(0, maxLikes); // number of crappy venues
	var color = '#' + rainbow.colourAt(crappyVenue.likes); // map into hex value

	// Draw the venue and display the information on the popup
	var venueCircle = L.circle([lat,lng], 50,{
	    stroke: false,
	    fillColor: color,
	    fillOpacity: 1
	}).on('mouseover',function(e){ // when user hover on the circle, it will shows the info
		bottomPart.innerHTML = 	'<span class="smallTitle">' + crappyVenue.name 
								+ '<br><br>' + '<img src="public/img/heart.png" id="heart"> '
								+ crappyVenue.likes + " likes"
								+ '<br>' + '<img src="public/img/marker.png" id="marker"> ' 
								+ crappyVenue.checkin + " check-ins"
								+ '<br><br>'
								+ '<br>' + 'Distance: '
								+ crappyVenue.location.distance + " m"
								+ '<br></span>'
								+ address + ', '
								+ city;
	})
	.addTo(map);


	// Clear out previous results first
	// (it should be inside of function scope) 
	function deleteCircles(myid){
		console.log("function is running");
		map.removeLayer(myid);
		return false;
	}

	$("#searchButton").on("click", function(){
		map.removeLayer(venueCircle);
	});

}




/////////////////////////////////////////////////////////////////
/////////////////////// when document is ready//////////////////
$(document).ready(function(){

	// getKeyData();
	
	// if close button is pressed, hide pop up div
	$("#close").click(function(){
		$("#covered").fadeOut('slow');
		$("#instruction").fadeOut('slow');
	});

	// Color indication 
	rainbow.setNumberRange(0, 5); 
	var s = '';
	for ( var i = 0; i <= 5; i++){
		var color = '#' + rainbow.colourAt(i); // map into hex value
		s += '<span class="bullet" style="color:' + color + '">' + '&#8226;' + '</span>';
	}
	document.getElementById("indication").innerHTML = s;

	// get rid of unecessary borders.. 
	$("#currentLoc").focus(function(){ $(this).blur(); });
	$("#searchButton").focus(function(){ $(this).blur(); });

	$("#coffee").focus(function(){ $(this).blur(); });
	$("#pudding").focus(function(){ $(this).blur(); });
	$("#cupcake").focus(function(){ $(this).blur(); });
	$("#yogurt").focus(function(){ $(this).blur(); });
	$("#bubble_tea").focus(function(){ $(this).blur(); });
	$("#dessert").focus(function(){ $(this).blur(); });
	$("#icecream").focus(function(){ $(this).blur(); });
	$("#sandwich").focus(function(){ $(this).blur(); });
	$("#noodle").focus(function(){ $(this).blur(); });

	// if user is pressed tag, fill out the form
	$("#coffee").click(function(){ $("#searchTerm").val("coffee"); });
	$("#pudding").click(function(){ $("#searchTerm").val("pudding"); });
	$("#cupcake").click(function(){ $("#searchTerm").val("cupcake"); });
	$("#yogurt").click(function(){ $("#searchTerm").val("yogurt"); });
	$("#bubble_tea").click(function(){ $("#searchTerm").val("bubble tea"); });
	$("#dessert").click(function(){ $("#searchTerm").val("dessert"); });
	$("#icecream").click(function(){ $("#searchTerm").val("ice cream"); });
	$("#sandwich").click(function(){ $("#searchTerm").val("sandwich"); });
	$("#noodle").click(function(){ $("#searchTerm").val("noodle"); });


	//MODE 1
	$("#currentLoc").click(function(){
		// empty address input first 
		$("#inputAddress").val('');
		mode = 1;
	});

	// search button
	$("#searchButton").click(function(){

		// MODE 2 
		// getting input values 
		var term = $("#searchTerm").val();
		var inputAddress = $("#inputAddress").val();
		if(inputAddress!== '' ){ 
			mode = 2;
		}


		if ( mode == 1  ){ // user pressed the currentLoc button
			console.log("***** MODE1 : USER USED CUREENT LOCATION");
			//console.log("loading current location of computer");
			bottomPart.innerHTML = "<br><span class='smallTitle'>It's loading</span>";

			// get current location of computer 
			navigator.geolocation.getCurrentPosition(function(location){
				var lat = location.coords.latitude;
				var lng = location.coords.longitude;

				// REQUEST FOURSQUARE DATA
				getFoursquareData(lat,lng, term);

				// DRAW CURRENT LOCATION - COMPUTER LOCATION
		    	drawCurrentLocation(lat,lng);

			});
		} else if( mode == 2 ) {  // OR user manually typed the information
			console.log("***** MODE2 : USER MANUALLY TYPED ADDRESS");
			geocodeLocation(inputAddress, term);

		} else { // IF USERS DO NOTHING
			console.log("***** you should set your address");
		}


	});
	//when done function
	

});