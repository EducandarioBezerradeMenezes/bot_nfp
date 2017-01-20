//Cupom Controller
//Cria rotas para verificação dos registros

//Modulo Express
var express = require('express');

//Modelos Cupom e Chave
var Cupom     = require('../model/cupom');
var Chave     = require('../model/chave');

//Rotas
var router  = express.Router();

//Metodos para rota /cupom
router.route('/cupom')

  //(PUT) seleciona estados de cupons
  .put(function(req, res){

    //Retorna estados e suas quantidades
    Cupom.qtdCupom(req.body).then(result =>{
      res.json(result);
    }).catch(err =>{res.status(500).send(err)});
  });

//Metodos para a rota /chave
router.route('/chave')

  //(PUT) seleciona estado das chaves
  .put(function(req, res){

    //Retorna estados e suas quantidades
    Chave.qtdChave(req.body).then(result =>{
      res.json(result);
    }).catch(err =>{res.status(500).send(err)});
  });

//Exporting Routes
module.exports = router;
