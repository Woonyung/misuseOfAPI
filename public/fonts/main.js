// will have to seperate the canvas later.......?

/*
   ___ _ _                __      __      __             
  / __| (_)__ _ _ _ ___  / _|___  \ \    / /__  ___ _ _  
 | (__| | / _` | '_/ -_) > _|_ _|  \ \/\/ / _ \/ _ \ ' \ 
  \___|_|_\__,_|_| \___| \_____|    \_/\_/\___/\___/_||_|

* visualization part + client side
*/
//////////////////////////////////////////////////////////
var data;
var padding = 60;

var canvasWidth = 1200;
var canvasHeight = 160;

//////////////////////////////////////////////////
// FACET 1
/////////////////////////////////////////////////
var sketch1 = function(sketch){

	// setup
	sketch.setup = function(){
		sketch.createCanvas(canvasWidth,canvasHeight);
		sketch.background(255);

		///////// scales ////////////////
		sketch.stroke(153);
		sketch.line(0,150,1000, 150); // horizontal line
		sketch.line(1, 140, 1, 150); // first 
		sketch.line(500,140,500,150); // middle point
		sketch.line(999,140,999,150); // end point
		//console.log("this is sketch1");


		$.getJSON('/ourResults', function(json){
			var data = json;
			console.log("---------- facet 1 ---------------");
			

			for ( var i = 0; i < data.length; i++){
				//var x = - data[i].

				var facet1 = JSON.parse(data[i].facet1);

			    ///avg for each facet
			    var a = -facet1.a;
			    var b = facet1.b;
		 		console.log("a:" + a);
		 		console.log("b:" + b);

		 		var avg= (a + b)/2;
		 		console.log("avg:" + avg);
		 		var totalScorefacet = sketch.map(avg, -10, 10, 0, 1000);
		 		console.log("total facet:"+ totalScorefacet);


				if (data[i].shape == 1){ // if code is 1 : ellipse
					sketch.noStroke();
					sketch.fill(data[i].r, data[i].g, data[i].b, 80);
					sketch.ellipseMode(sketch.CENTER);
					sketch.ellipse(totalScorefacet, 100, 30, 30);
				} else if (data[i].shape == 2){ // if code is 2 : rect
					//console.log("this is code 2");
					sketch.noStroke();
					sketch.fill(data[i].r, data[i].g, data[i].b, 80);
					sketch.rectMode(sketch.CENTER);
					sketch.rect( totalScorefacet, 100, 30, 30);
				}
			}

		});	

	}; // setup function 
}; //sketch 1 


//////////////////////////////////////////////////
// FACET 2
/////////////////////////////////////////////////
var sketch2 = function(sketch){

	// setup
	sketch.setup = function(){
		sketch.createCanvas(canvasWidth,canvasHeight);
		sketch.background(255);
		sketch.noStroke();

		//console.log("this is sketch2");

		///////// scales ////////////////
		sketch.stroke(153);
		sketch.line(0,150,1000, 150); // horizontal line
		sketch.line(1, 140, 1, 150); // first 
		sketch.line(500,140,500,150); // middle point
		sketch.line(999,140,999,150); // end point


		$.getJSON('/ourResults', function(json){
			var data = json;
			console.log("---------- facet 1 ---------------");
			

			for ( var i = 0; i < data.length; i++){
				//var x = - data[i].

				var facet1 = JSON.parse(data[i].facet1);

			    ///avg for each facet
			    var a = -facet2.a;
			    var b = facet2.b;
		 		console.log("a:" + a);
		 		console.log("b:" + b);

		 		var avg= (a + b)/2;
		 		console.log("avg:" + avg);
		 		var totalScorefacet = sketch.map(avg, -10, 10, 0, 1000);
		 		console.log("total facet:"+ totalScorefacet);


				if (data[i].shape == 1){ // if code is 1 : ellipse
					sketch.noStroke();
					sketch.fill(data[i].r, data[i].g, data[i].b, 80);
					sketch.ellipseMode(sketch.CENTER);
					sketch.ellipse(totalScorefacet, 100, 30, 30);
				} else if (data[i].shape == 2){ // if code is 2 : rect
					//console.log("this is code 2");
					sketch.noStroke();
					sketch.fill(data[i].r, data[i].g, data[i].b, 80);
					sketch.rectMode(sketch.CENTER);
					sketch.rect( totalScorefacet, 100, 30, 30);
				}
			}

		});	

	}; // setup function 
}; //sketch 1 



//////////////////////////////////////////////////
// FACET 3
/////////////////////////////////////////////////
var sketch3 = function(sketch){

	// setup
	sketch.setup = function(){
		sketch.createCanvas(canvasWidth,canvasHeight);
		sketch.background(255);
		sketch.noStroke();

		///////// scales ////////////////
		sketch.stroke(153);
		sketch.line(0,150,1000, 150); // horizontal line
		sketch.line(1, 140, 1, 150); // first 
		sketch.line(500,140,500,150); // middle point
		sketch.line(999,140,999,150); // end point

		$.getJSON('/ourResults', function(json){
			console.log("============facet 2===========");
			var data = json;
			console.log(data);
		});	

	}; // setup function 
}; //sketch 3


//////////////////////////////////////////////////
// FACET 4
/////////////////////////////////////////////////
var sketch4 = function(sketch){

	// setup
	sketch.setup = function(){
		sketch.createCanvas(canvasWidth,canvasHeight);
		sketch.background(255);
		sketch.noStroke();

		///////// scales ////////////////
		sketch.stroke(153);
		sketch.line(0,150,1000, 150); // horizontal line
		sketch.line(1, 140, 1, 150); // first 
		sketch.line(500,140,500,150); // middle point
		sketch.line(999,140,999,150); // end point

		$.getJSON('/ourResults', function(json){
			console.log("============facet 2===========");
			var data = json;
			console.log(data);
		});	

	}; // setup function 
}; //sketch 2



//////////////////////////////////////////////////
// OVERALL
/////////////////////////////////////////////////
var sketch5 = function(sketch){

	// setup
	sketch.setup = function(){
		sketch.createCanvas(canvasWidth,canvasHeight);
		sketch.background(255);
		sketch.noStroke();

		///////// scales ////////////////
		sketch.stroke(153);
		sketch.line(0,150,1000, 150); // horizontal line
		sketch.line(1, 140, 1, 150); // first 
		sketch.line(500,140,500,150); // middle point
		sketch.line(999,140,999,150); // end point

		$.getJSON('/ourResults', function(json){
			console.log("============facet 2===========");
			var data = json;
			console.log(data);
		});	

	}; // setup function 
}; //sketch 5

// adding canvas to 
var p51 = new p5(sketch1, 'facet1Results');
var p52 = new p5(sketch2, 'facet2Results');
var p53 = new p5(sketch3, 'facet3Results');
var p54 = new p5(sketch4, 'facet4Results');
var p55 = new p5(sketch5, 'overallResults');
