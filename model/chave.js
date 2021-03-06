//Chave Model
//Comunicação com banco de dados

//Usa o modulo pg (PostgresSQL)
var pg = require('pg');

//Conexão com PostgreSQL
pg.defaults.ssl = true;
const connectionString = "postgres://postgres:mateus123mudar@localhost:5432/ebm_notas";

//Seleciona todas as chaves
var _selectChave = function(estado){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  return new Promise((result, resolve) => {

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
      resolve(result.rows);
    });
  });
}

//Atualiza estado de uma chave especifica
var _updateChave = function(chave){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  return new Promise((result, resolve) => {

    //Query Atualiza todos os cupons
    var query = client.query('UPDATE chaves SET estado=$1 WHERE valor=$2',[chave.estado, chave.valor]).then(function(){

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
var _deleteChave = function(chave){

  //Conecta com Postgres
  var client = new pg.Client(process.env.DATABASE_URL || connectionString);
  client.connect();

  //Cria uma Promessa
  return new Promise((resolve, reject) => {

    //Query para deletar um cupom expecifico
    client.query('DELETE FROM chaves WHERE valor=$1',[chave.valor]).then(function(){

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

//Seleciona todas as chaves
var _qtdChave = function(date){

  //Conecta com Postgres
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma Promessa
  return new Promise((resolve, reject) => {

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
      resolve(result.rows);
    });
  });
}

//Funções a serem exportadas (Usadas por outros arquivos)
module.exports = {
  selectChave: _selectChave,
  updateChave: _updateChave,
  deleteChave: _deleteChave,
  qtdChave   : _qtdChave,
}
