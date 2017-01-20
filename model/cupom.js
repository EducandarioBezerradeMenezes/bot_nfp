//Cupom Model
//Comunicação com banco de dados

//Usa o modulo pg (PostgresSQL)
var pg = require('pg');

//Conexão com PostgreSQL
pg.defaults.ssl = true;
const connectionString = "postgres://postgres:mateus123mudar@localhost:5432/ebm_notas";

//Seleciona todos os cupons
var _selectCupom = function(estado){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  return new Promise(() => {

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
      resolve(result.rows);
    });
  });
}

//Atualiza estado de um cupom especifico
var _updateCupom = function(cupom){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  return new Promise((resolve, reject) => {

    //Query Atualiza todos os cupons
    var query = client.query('UPDATE cupons SET estado=$1 WHERE coo=$2',[cupom.estado, cupom.coo]).then(function(){

      //Termina a conexão
      client.end();

      //Resolve Promessa ao fim da Query
      resolve('OK');

    }, function(err){

      //Rejeita Promessa
      reject(err);
    });
  });
}

//Deleta um cupom
var _deleteCupom = function(cupom){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  return new Promise((resolve, reject) => {

    //Query para deletar um cupom expecifico
    client.query('DELETE FROM cupons WHERE coo=$1',[cupom.coo]).then(function(){

      //Termina a conexão
      client.end();

      //Resolve Promessa ao fim da Query
      resolve('OK');

    }, function(err){

      //Rejeita Promessa
      reject(err);
    });
  });
}

var _qtdCupom = function(date){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  return new Promise((resolve, reject) => {

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
      resolve(result.rows);
    });
  });
}

//Funções a serem exportadas (Usadas por outros arquivos)
module.exports = {
  selectCupom: _selectCupom,
  updateCupom: _updateCupom,
  deleteCupom: _deleteCupom,
  qtdCupom   : _qtdCupom,
}
