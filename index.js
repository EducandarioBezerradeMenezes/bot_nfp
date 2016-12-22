//Index File
//Cria um Server API/BOT

//Modulos
var express    = require('express');
var bodyParser = require('body-parser');

//Adiciona Controllers
var cupom = require('./controller/cupomController');
var bot   = require('./controller/botController');
var user  = require('./controller/userController');

//Cria aplicação
var app = express();

//Identifica o corpo das requests (JSON)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Permite requisição de diferentes metodos origens e cabeçalhos
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//API Rest
app.use(cupom);
app.use(bot);
app.use(user);

//Erro 404 para paginas não encontradas
app.use(function(req, res){
  res.sendStatus(404);
});

//Server Online
app.listen(80085, function(){

});
