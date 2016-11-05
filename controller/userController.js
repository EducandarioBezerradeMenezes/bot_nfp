//Cupom Controller
//Cria rotas para o cadastro de cupom

//Modulo Express
var express = require('express');

//Modelo usuario
var User = require('../model/user');

//Rotas
var router  = express.Router();

//Metodos para a rota /user
router.route('/user')

  //POST (inseri) um novo usuario
  .post(function(req, res){

    //Inserção do Usuario
    User.insertUser(req.body)
      .then(result =>{res.json(result)})
      .catch(err   =>{res.json(err)});
  });

//Metodos para a rota /logIn
router.route('/logIn')

  //(POST) execução de um Log-in
  .post(function(req, res){

    //Log-in do Usuario
    User.logIn(req.body)
      .then(result =>{res.json(result)})
      .catch(err   =>{res.json(err)});
  })

  //PUT (atualiza) senha do usuario
  .put(function(req, res){

    //Atualização da senha
    User.newPassword(req.body)
      .then(result =>{res.json(result)})
      .catch(err   =>{res.json(err)});
  });

//Metodos para a rota /admin
router.route('/admin')

  //(GET) Cria um usuario admin para testes
  .get(function(req, res){

    //Usuario administrador
    var admin = {
      email:    'mateus.oli.car@gmail.com',
      name:     'admin',
      password: 'admin'
    };

    //Inserio o usuario
    User.insertUser(admin)
      .then(result =>{res.json(result)})
      .catch(err   =>{res.json(err)});
  });

//Exporting Routes
module.exports = router;
