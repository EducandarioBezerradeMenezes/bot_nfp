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

  //GET (Seleciona) estados de cupons
  .get(function(req, res){

    //Retorna estados e suas quantidades
    Cupom.qtdCupom(req.body).then(result =>{
      res.json(result);
    }).catch(err =>{res.json(err)});
  });

//Metodos para a rota /chave
router.route('/chave')

  //GET (Seleciona) estado das chaves
  .get(function(req, res){

    //Retorna estados e suas quantidades
    Chave.qtdChave(req.body).then(result =>{
      res.json(result);
    }).catch(err =>{res.json(err)});
  });

//Exporting Routes
module.exports = router;
