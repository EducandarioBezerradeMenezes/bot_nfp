//User Model
//Comunicação com banco de dados

//Usa o modulo pg (PostgreSQL)
var pg = require('pg');

//Encriptação de senhas
var bcrypt = require('bcryptjs');

//Chave de Segurança
var key = 'A resposta para a vida o universo e tudo mais é 42';

//Conexão com PostgreSQL
pg.defaults.ssl = true;
const connectionString = "postgres://postgres:mateus123mudar@localhost:5432/ebm_notas";

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

  //Encripta a senha
  bcrypt.hash(user.password, 10, (err, hash) =>{

    //Erro para hash
    if(err) defer.reject(err);

    //Query PostgreSQL para inserção de novo usuario
    if(!err) client.query('INSERT INTO users (email, name, password) values ($1, $2, $3)', [user.email, user.name, hash]).then(function(){

      //Fecha conexão
      client.end();

      //Resolve Promessa com termino da query
      defer.resolve('OK');

    }).catch(err =>{

      //Rejeita Promessa
      defer.reject(err);
    });
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
  var query = client.query('SELECT * from users WHERE email=$1 OR name=$2',[user.email, user.name]);

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

    //Compara senha enviada com senha encriptada em banco
    else bcrypt.compare(user.password, result.rows[0].password, (err, res) =>{

      //Deleta a senha para enviar o usuario
      delete result.rows[0].password;

      //Erro de comparação com o hash
      if(err) defer.reject(err);

      //Retorna o usuario caso a comparaçao seja verdadeira
      else if(res) defer.resolve(result.rows[0]);

      //Retorna erro de password se comparação for falsa
      else defer.reject('password');
    });
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

  //Encritpa a senha
  bcrypt.hash(user.password, 10, (err, hash) =>{

    //Erro para hash
    if(err) defer.reject(err);

    //Query PostgreSQL para mudança de senha
    if(!err) client.query('UPDATE users SET password=$1 WHERE email=$2', [hash, user.email]).then(function(){

      //Fecha conexão
      client.end();

      //Resolve Promessa com termino da query
      defer.resolve('OK');

    }).catch(err =>{

      //Rejeita Promessa
      defer.reject(err);
    });
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
  client.query('DELETE FROM users WHERE email=$1 AND name=$2',[user.email, user.name]).then(function(){

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

//Checa existencia de um usuario
var _checkUser = function(user){

  //Conexão
  var client = new pg.Client(connectionString);
  client.connect();

  //Cria uma promessa
  var defer = Promise.defer();

  //Seleciona um usuario se este existe
  var query = client.query('SELECT email, name from users WHERE email=$1', [user.email]);

  //Adiciona usuario
  query.on('row', function (row, result) {

    result.addRow(row);
  });

  //Termino da query
  query.on('end', function (result) {

    //Fecha conexão
    client.end();

    //Retorna o usuario ou um erro
    if(result.rows[0]) defer.resolve(result.rows[0]);
    else defer.reject('user');
  });

  //Retorna promessa
  return defer.promise;
}

//Funções a serem usadas por outros modulos
module.exports = {
  insertUser:  _insertUser,
  logIn:       _logIn,
  newPassword: _newPassword,
  deleteUser:  _deleteUser,
  checkUser:   _checkUser
}
