var express = require ('express');
var expressHandlebars = require('express3-handlebars'); //execute the express


var app = express();
var handlebars = expressHandlebars.create({defaultLayout: 'main'});


app.use('/public', express.static('public')); // this will work

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  res.render('index');
});


// // send key and tokens to the client
// app.get('/ajaxRequest', function(req,res){
// 	var TOKENS = {
// 		// CLIENT_ID : process.env.CLIENT_ID,
// 		// CLIENT_SECRET : process.env.CLIENT_SECRET
// 		CLIENT_ID :'LRA3W40OXBY23HIMLOHUZZS5ABC503FHOP02D2BT4PDW55CZ',
// 		CLIENT_SECRET :'5KP5CRW4SZ3ZIKCLP5PYSBELC2RVBO41JY30HVDYUPEGCOEP'
// 	};
// 	console.log(TOKENS);
// 	res.send(TOKENS);
// });


////
app.get('/photos', function(req,res){
	res.render('photo', {title: "photo essays"});
});

var port = Number(process.env.PORT|| 5000);
console.log("listening on port", port);
app.listen(port);