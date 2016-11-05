//User Model
//Comunicação com banco de dados

//usa o modulo pg (PostgreSQL)
var pg = require('pg');

//Conexão com PostgreSQL
pg.defaults.ssl = true;
var connectionString = 'postgres://palffuboakjyaz:FMMpU1-5Ot5STXlJvbrgKaIyt6@ec2-54-163-248-218.compute-1.amazonaws.com:5432/ddorvpnoikl99p';

//Cria a tabela
var _createTable = function(client){

  //Table Script
  client.query('CREATE TABLE IF NOT EXISTS users ('
                + 'email VARCHAR(255) PRIMARY KEY,'
                + 'name VARCHAR(255) UNIQUE,'
                + 'password VARCHAR(255) NOT NULL'
              + ');');
}

//Cria um novo usuario
var _insertUser = function(user){

  //Conexão
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma promessa
  var defer = Promise.defer();

  //Cria tabela se não existe
  _createTable(client);

  //Query PostgreSQL para inserção de novo usuario
  client.query('INSERT INTO user (email, name, password) values ($1, $2, $3)', [user.email, user.name, user.password]).then(function(){

    //Fecha conexão
    client.end();

    //Resolve Promessa com termino da query
    defer.resolve('OK');

  }).catch(err =>{

    //Rejeita Promessa
    defer.reject(err);
  });

  //Retorna promessa
  return defer.promise;
}

//Lon-In de usuario
var _logIn = function(user){

  //Conexão
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria tabela se não existe
  _createTable(client);

  //Cria promessa
  var defer = Promise.defer();

  //Query PostgreSQL para selecionar usuario
  var query = client.query('SELECT * from user WHERE email=$1 OR name=$2',[user.email, user.name]);

  //Adiciona usuario
  query.on('row', function (row, result) {

    result.addRow(row);
  });

  //Termino da query

  query.on('end', function (result) {
    //Fecha conexão
    client.end();

    //Verifica Validade do Usuario
    if(!result.rows[0]) defer.reject('user');
    if(result.rows[0].password != user.password) defer.reject('password');

    //Retorna usuario
    else{
      delete result.rows[0].password;
      defer.resolve(result.rows[0])
    };
  });

  //Retorna promessa
  return defer.promise;
}

//Cria uma nova senha
var _newPassword = function(user){

  //Conexão
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma promessa
  var defer = Promise.defer();

  //Cria tabela se não existe
  _createTable(client);

  //Query PostgreSQL para mudança de senha
  client.query('UPDATE users SET password=$1 WHERE email=$2', [user.password, user.email]).then(function(){

    //Fecha conexão
    client.end();

    //Resolve Promessa com termino da query
    defer.resolve('OK');

  }).catch(err =>{

    //Rejeita Promessa
    defer.reject(err);
  });

  //Retorna promessa
  return defer.promise;
}

//Deleta um usuario
var _deleteUser = function(user){

  //Conexão
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma promessa
  var defer = Promise.defer();

  //Query PostgreSQL para deletar um usuario
  client.query('DELETE FROM users WHERE email=$1 AND password=$2',[user.email, user.password]).then(function(){

    //Fecha Conexão
    client.end();

    //Resolve promessa com fim da query
    defer.resolve('OK');

  }).catch(err =>{

    //Rejeita promessa
    defer.reject(err);
  });

  //Retorna promessa
  return defer.promise;
}

//Funções a serem usadas por outros modulos
module.exports = {
  insertUser:  _insertUser,
  logIn:       _logIn,
  newPassword: _newPassword,
  deleteUser:  _deleteUser
}
