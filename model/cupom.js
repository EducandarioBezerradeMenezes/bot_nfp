//Cupom Model
//Comunicação com banco de dados

//Usa o modulo pg (PostgresSQL)
var pg = require('pg');

//Conexão com PostgreSQL
pg.defaults.ssl = true;
var connectionString = 'postgres://palffuboakjyaz:FMMpU1-5Ot5STXlJvbrgKaIyt6@ec2-54-163-248-218.compute-1.amazonaws.com:5432/ddorvpnoikl99p';

//Seleciona todos os cupons
var _selectCupom = function(estado){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  var defer = Promise.defer();

  //Query seleciona todos os cupons
  var query;

  //Seleciona cupons
  if(!estado) query = client.query('SELECT * FROM cupons WHERE estado!=1 AND estado!=2');
  if(estado)  query = client.query('SELECT * FROM cupons WHERE estado=$1', [estado]);

  //Adciona cada linha da tabela
  query.on('row', function (row, result) {

    result.addRow(row);
  });

  //Termino da Query
  query.on('end', function (result) {

    //Termina a conexão
    client.end();

    //Resolve Promessa
    defer.resolve(result.rows);
  });

  //Retorna Promessa
  return defer.promise;
}

//Atualiza estado de um cupom especifico
var _updateCupom = function(cupom){

    //Conecta com Postgres
    var client = new pg.Client(connectionString);
    client.connect();

    //Cria uma Promessa
    var defer = Promise.defer();

    //Query Atualiza todos os cupons
    var query = client.query('UPDATE cupons SET estado=$1 WHERE coo=$2',[cupom.estado, cupom.coo]).then(function(){

      //Termina a conexão
      client.end();

      //Resolve Promessa ao fim da Query
      defer.resolve('OK');

    }, function(err){

      //Rejeita Promessa
      defer.reject(err);
    });

  //Retorna Promessa
  return defer.promise;
}

//Deleta um cupom
var _deleteCupom = function(cupom){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  var defer = Promise.defer();

  //Query para deletar um cupom expecifico
  client.query('DELETE FROM cupons WHERE coo=$1',[cupom.coo]).then(function(){

    //Termina a conexão
    client.end();

    //Resolve Promessa ao fim da Query
    defer.resolve('OK');

  }, function(err){

    //Rejeita Promessa
    defer.reject(err);
  });

  //Retorna Promessa
  return defer.promise;
}

var _qtdCupom = function(date){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  var defer = Promise.defer();

  //Quantidade de cada estado
  if(date.year)      var query = client.query('SELECT estado, EXTRACT(YEAR FROM data) AS year, EXTRACT(MONTH FROM data) AS month, COUNT(*) AS quantity FROM cupons GROUP BY estado, year, month HAVING EXTRACT(YEAR FROM data)=$1 AND EXTRACT(MONTH FROM data)=$2',[date.year, date.month]);
  else if(date.show) var query = client.query('SELECT estado, EXTRACT(YEAR FROM data) AS year, EXTRACT(MONTH FROM data) AS month, COUNT(*) AS quantity FROM cupons GROUP BY estado, year, month');
  else               var query = client.query('SELECT estado, COUNT(*) AS quantity FROM cupons GROUP BY estado');

  //Adciona cada linha da tabela
  query.on('row', function (row, result) {

    result.addRow(row);
  });

  //Termino da Query
  query.on('end', function (result) {

    //Termina a conexão
    client.end();

    //Resolve Promessa
    defer.resolve(result.rows);
  });

  //Retorna Promessa
  return defer.promise;
}

//Funções a serem exportadas (Usadas por outros arquivos)
module.exports = {
  selectCupom: _selectCupom,
  updateCupom: _updateCupom,
  deleteCupom: _deleteCupom,
  qtdCupom   : _qtdCupom,
}
