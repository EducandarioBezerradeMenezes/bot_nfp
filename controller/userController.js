//Cupom Controller
//Cria rotas para o cadastro de cupom

//Modulo Express
var express = require('express');

//Modelo usuario
var User = require('../model/user');

//Servico de envio de email
var Email = require('../service/emailService.js');

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
  })

  //PUT (atualiza) senha do usuario
  .put(function(req, res){

    //Atualização da senha
    User.newPassword(req.body)
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

  //(PUT) Recupera informações de Usuario
  .put(function(req, res){

    //Cria uma senha aleatoria
    req.body.password = Math.floor(Math.random() * 1000000000);

    //Muda a antiga senha para a nova gerada
    User.newPassword(req.body).then(result =>{

      //Envia o email com a nova senha
      Email.sendEmail(req.body).then(result =>{

        res.json("OK");

      //Erro de envio
      }).catch(err =>{res.json(err)});

    //Erro de troca de senha
    }).catch(err =>{res.json(err)});
  });

//Exporting Routes
module.exports = router;
