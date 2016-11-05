//Chave Model
//Comunicação com banco de dados

//Usa o modulo pg (PostgresSQL)
var pg = require('pg');

//Conexão com PostgreSQL
pg.defaults.ssl = true;
var connectionString = 'postgres://palffuboakjyaz:FMMpU1-5Ot5STXlJvbrgKaIyt6@ec2-54-163-248-218.compute-1.amazonaws.com:5432/ddorvpnoikl99p';

//Seleciona todas as chaves
var _selectChave = function(estado){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  var defer = Promise.defer();

  //Query seleciona todas as chaves
  if(!estado) var query = client.query('SELECT * FROM chaves WHERE estado!=1 AND estado!=2');
  if(estado)  var query = client.query('SELECT * FROM chaves WHERE estado=$1',[estado]);

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

//Atualiza estado de uma chave especifica
var _updateChave = function(chave){

    //Conecta com Postgres
    var client = new pg.Client(connectionString);
    client.connect();

    //Cria uma Promessa
    var defer = Promise.defer();

    //Query Atualiza todos os cupons
    var query = client.query('UPDATE chaves SET estado=$1 WHERE valor=$2',[chave.estado, chave.valor]).then(function(){

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
var _deleteChave = function(chave){

  //Conecta com Postgres
  var client = new pg.Client(process.env.DATABASE_URL || connectionString);
  client.connect();

  //Cria uma Promessa
  var defer = Promise.defer();

  //Query para deletar um cupom expecifico
  client.query('DELETE FROM chaves WHERE valor=$1',[chave.valor]).then(function(){

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

//Seleciona todas as chaves
var _qtdChave = function(date){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  var defer = Promise.defer();

  //Quantidade de cada estado
  if(!date.year) var query = client.query('SELECT estado, COUNT(*) AS quantity FROM chaves GROUP BY estado');
  else           var query = client.query('SELECT estado, EXTRACT(YEAR FROM data) AS year,  EXTRACT(MONTH FROM data) AS month, COUNT(*) AS quantity FROM chaves GROUP BY estado, year, month');


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
  selectChave: _selectChave,
  updateChave: _updateChave,
  deleteChave: _deleteChave,
  qtdChave   : _qtdChave,
}
