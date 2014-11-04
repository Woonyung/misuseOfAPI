/*

Appropriating Interaction Technology
Assignment #2 : misuse of API 

Oct 31th, 2014
woonyungchoi@gmail.com

09.
back to foursquare API - venue
parsing like counting
get Foursquare data -> get Like data (id)

sorted only crappy place near me..
but I wanted to expand as cities...

*/

var mode;
var responseLength = -1;

// Foursqaure Data
function FoursqaureData(id, name, location){
	var FS = this;
	FS.id = id;
	FS.name = name;
	FS.location = location;
	FS.likes = '';

}

///////////////////////////////////////////////////////////
////////////////////  Foursquare keys  //////////////////
var CLIENT_ID ='-';
var CLIENT_SECRET ='-';


// array to store our objects
var foursquareArray = [];
var limit = 50; // number of venue that I want to look for 

function getFoursquareData(lat, lng){
	// empty the array 
	foursquareArray = [];

	var baseURL = "https://api.foursquare.com/v2/venues/search?";
	$.ajax({
		//url: baseURL + lat + "," + lng +'&client_id='+ CLIENT_ID+'&client_secret='+ CLIENT_SECRET+'&v=20141101',
		url: baseURL + 
			'll='+ lat + "," + lng +
			'&limit='+ limit+
			'&client_id='+ CLIENT_ID+'&client_secret='+ CLIENT_SECRET+'&v=20141101',
		type: 'GET',
		dataType: 'jsonp',
		success: function(data){
			responseLength = data.response.venues.length;
			console.log("RL: " + responseLength);

			// console.log(data.response.venues[0].location);

			for ( var i = 0; i < data.response.venues.length; i++){
				if (data.response.venues[i] != null){
					var tempObject = new FoursqaureData(data.response.venues[i].id,
														data.response.venues[i].name,
														data.response.venues[i].location);
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
	//console.log(id);

	var baseURL = 'https://api.foursquare.com/v2/venues/';
	$.ajax({
		url: baseURL + id + '/likes?&client_id='+ CLIENT_ID+'&client_secret='+ CLIENT_SECRET+'&v=20141101',
		type: 'GET',
		dataType: 'jsonp',
		success: function(data){
			// push into array

			var myLike = data.response.likes.count;
			//console.log(data.response.likes.count);
			tempObject.likes = data.response.likes.count;
			foursquareArray.push(tempObject);
			console.log("FS Array: "+foursquareArray.length);

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
	//console.log(foursquareArray);

	// sorted objects by descending order of like
	var sortedArray = foursquareArray.sort(function(a, b){
		return a.likes-b.likes;
	});
	console.log(sortedArray); 

	for (var i = 0; i < sortedArray.length; i++){
		// if like count is less than 5, draw the circle
		if ( sortedArray[i].likes < 5){
			// draw points of crappy places
			drawVenues(sortedArray[i]);
		}
	}

}

///////////////////////////////////////////////////////////////////
/////////////////////////// LOAD THE MAP //////////////////////////
// draw basic map
var zoom = 18;

L.mapbox.accessToken = '-';
// Create a map in the div #map
var map = L.mapbox.map('map', '-')
	.setView([40.73, -74.00], 15); // default view 


// Geo Coding - for current location (input)
function geocodeLocation(address){
	// geocode
	var geocoder = L.mapbox.geocoder('mapbox.places-v1'); 
	geocoder.query(address, function(err, data){
		if (data.lbounds) {
		    map.fitBounds(data.lbounds);
		} else if (data.latlng) {
			// convert into lat/ lng values
			var lat = data.latlng[0];
			var lng = data.latlng[1];

		    // REQUEST FOURSQUARE DATA
			getFoursquareData(lat,lng);

		    // DRAW CURRENT LOCATION
		    drawCurrentLocation(lat,lng, 'rgb(255,0,0)');

		} // end of else if
	}); // end of geocode query function
}

//////// DRAW CURRENT LOCATION
function drawCurrentLocation(lat,lng, color){
	map.setView([lat, lng], zoom); // set view
	var currentCircle = L.circle([lat,lng], 5,{
	    stroke: false,
	    fillColor: color,
	    fillOpacity: 1
	}).addTo(map)
	.bindPopup("current location");
}


//////// DRAW VENUES NEAR ME
function drawVenues(crappyVenue){
	console.log(crappyVenue.likes);
	//var popupContent = crappyVenue.likes;
	var currentCircle = L.circle([crappyVenue.location.lat,crappyVenue.location.lng], 3,{
	    stroke: false,
	    fillColor: 'rgb(0,0,0)',
	    fillOpacity: 1
	}).addTo(map)
	.bindPopup(crappyVenue.name);

}

/////////////////////////////////////////////////////////////////
/////////////////////// when document is ready//////////////////
$(document).ready(function(){

	// get rid of unecessary borders.. 
	$("#currentLoc").focus(function(){
		$(this).blur();
	});


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
		var inputAddress = $("#inputAddress").val();
		if(inputAddress!== '' ){ 
			mode = 2;
		}

		if ( mode == 1  ){ // user pressed the currentLoc button
			console.log("***** MODE1 : USER USED CUREENT LOCATION");
		 	// [] loading screen/ indication would be needed
			console.log("loading current location of computer");
			// get current location of computer 
			navigator.geolocation.getCurrentPosition(function(location){
				var lat = location.coords.latitude;
				var lng = location.coords.longitude;

				// REQUEST FOURSQUARE DATA
				getFoursquareData(lat,lng);

				// DRAW CURRENT LOCATION - COMPUTER LOCATION
		    	drawCurrentLocation(lat,lng, 'rgb(0,0,255)');

			});
		} else if( mode == 2 ) {  // OR user manually typed the information
			//console.log("***** MODE2 : USER MANUALLY TYPED ADDRESS");
			geocodeLocation(inputAddress);

			// if ( nothingFounded ){
			// 	console.log("***** you should set your address");
			// } else {
			// 	geocodeLocation(inputAddress);
			// }

		} else { // IF USERS DO NOTHING
			console.log("***** you should set your address");
		}


	});
	//when done function

});