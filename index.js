//Index File
//Create Server API/BOT

//Require Node Modules
var express    = require('express');
var bodyParser = require('body-parser');

//Add Controllers
var cupom    = require('./controller/cupomController');

// Create the Application.
var app = express();

//Indentify the body of the Request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Allow diferent origins, methods and headers
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//REST API
app.use(cupom);

//If Not Found send error 404
app.use(function(req, res){
  res.sendStatus(404);
});

//Launch Server
app.listen(process.env.PORT || 8000, function(){
  
});
