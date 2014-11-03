/*

Appropriating Interaction Technology
Assignment #2 : misuse of API 

Oct 31th, 2014
woonyungchoi@gmail.com

06.
back to foursquare API - venue
parsing like counting

get Foursquare data -> get Like data (id)

*/

var mode;

// Foursqaure Data
function FoursqaureData(id, name, location){
	var FS = this;
	FS.id = id;
	FS.name = name;
	FS.location = location;
	FS.likes = '';

}

/////////////////////// Foursquare keys //////////////////
var oAuth = "-";

// array to store our objects
var foursquareArray = [];

function getFoursquareData(lat, lng){
	// empty the array 
	foursquareArray = [];
	var baseURL = "https://api.foursquare.com/v2/venues/search?ll=";
	$.ajax({
		url: baseURL + lat + "," + lng + "&oauth_token=" + oAuth,
		type: 'GET',
		dataType: 'jsonp',
		success: function(data){
			// console.log(data.response.venues[0].location);
			for ( var i = 0; i < data.response.venues.length; i++){
				//console.log(data.response.venues[i].id);
				var tempObject1 = new FoursqaureData(data.response.venues[i].id,
													data.response.venues[i].name,
													data.response.venues[i].location);
				foursquareArray.push(tempObject1);
			}

			getLikeData(foursquareArray);
	
		},
		error: function(data){
		    console.log(data);
		    console.log("we have problem in getting foursquare data");
		}
  	});
}

// create empty array for holding all like counts
var likeArray = [];

function getLikeData(foursquareArray){
	// empty the array 
	likeArray = [];

	// Storing id, so that I can pass into ajax request
	for (var i = 0; i < foursquareArray.length; i++){
		console.log("storing id");
		var id = foursquareArray[i].id;
		console.log(id);

		var baseURL = 'https://api.foursquare.com/v2/venues/';
		$.ajax({
			url: baseURL + id + "/likes?oauth_token=" + oAuth,
			type: 'GET',
			dataType: 'jsonp',
			success: function(data){
				// push into array
				likeArray.push(data.response.likes.count);
				//console.log(likeArray);

				// put like values in foursquare array 
				for ( var i = 0; i < likeArray.length; i++){
					foursquareArray[i].likes = likeArray[i];
				}

			},
			error: function(err){
				console.log("we have problem in getting Like Data");
			}
		});
	}

	mapTheData(foursquareArray);
}

function mapTheData(foursquareArray){
	console.log("map the data function");
	console.log(foursquareArray);
	for (var i = 0; i < foursquareArray.length; i++){
		if( typeof foursquareArray[i].likes === 'number'){
			console.log(foursquareArray[i].likes);
		}
	}
}


/////////////////////////// LOAD THE MAP //////////////////
// draw basic map
var zoom = 15;

L.mapbox.accessToken = '-';
// Create a map in the div #map
var map = L.mapbox.map('map', '-')
	.setView([40.73, -74.00], zoom); // default view 


// Geo Coding - for current location (input)
function geocodeLocation(address){
	// geocode
	var geocoder = L.mapbox.geocoder('mapbox.places-v1'); 
	geocoder.query(address, function(err, data){
		if (data.lbounds) {
		    map.fitBounds(data.lbounds);
		} else if (data.latlng) {
			// convert into lat/ lng values
			console.log(data.latlng);
			var lat = data.latlng[0];
			var lng = data.latlng[1];


		    // REQUEST FOURSQUARE DATA
			getFoursquareData(lat,lng);

		    // DRAW CURRENT LOCATION
		    // red 
		    drawCurrentLocation(lat,lng, 'rgb(255,0,0)');
		} // end of else if
	}); // end of geocode query function
}

//////// DRAW CURRENT LOCATION
function drawCurrentLocation(lat,lng, color){
	map.setView([lat, lng], zoom); // set view
	var currentCircle = L.circle([lat,lng], 20,{
	    stroke: false,
	    fillColor: color,
	    fillOpacity: 1
	}).addTo(map)
	.bindPopup("current location");
}



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
		// // clear off foursquare array?
		// foursquareArray = [];
		// likeArray = [];
		
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
				console.log(lat + ","+ lng);

				// REQUEST FOURSQUARE DATA
				getFoursquareData(lat,lng);

				// DRAW CURRENT LOCATION - COMPUTER LOCATION
				// yellow
		    	drawCurrentLocation(lat,lng, 'rgb(255,255,0)');

			});
		} else if( mode == 2 ) {  // OR user manually typed the information
			console.log("***** MODE2 : USER MANUALLY TYPED ADDRESS");
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

});