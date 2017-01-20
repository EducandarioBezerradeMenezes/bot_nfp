//Bot Controller
//Cria rotas para a utilização do bot

//Modulo Express
var express = require('express');

//Modelos Cupom e Chave
var Cupom     = require('../model/cupom');
var Chave     = require('../model/chave');

//Navegação
var Navigator = require('../service/navigatorService');

//Usuario
var usuario = {
  cpf:   '45667474840',
  senha: 'segredo2102'
};

//Abre Pagina de Regstro
Navigator.toCupomRegister(usuario);

//Rotas
var router  = express.Router();

//Metodos para rota /cupom
router.route('/cupom')

  //POST (Inseri) o captcha e registra cupons
  .post(function(req, res){

    //Primeira Iteração
    var first = true;

    //Inseri o valor do Captcha
    Navigator.setCaptcha(req.body.valor);

    Cupom.selectCupom().then(cupons => {

      //Todos os Cupons ja Cadastrados
      if(!cupons[0]) res.json('OK');

      cupons.forEach(cupom => {

        //Salva cupom no site da receita
        Navigator.registerCupom(cupom).then(result =>{

          //Altera estado do cupom para 1 (Sucesso)
          cupom.estado = 'cadastrado';

          //Atualiza cupom no banco
          Cupom.updateCupom(cupom).then(result =>{

            //Envia resposta se primeira iteração
            if(first){
              res.json(result);
              first = false;
            }
          });
        }).catch(err => {

          //Altera estado do cupom para (Falha de Cadastro)
          cupom.estado = 'cadastro erro';

          //Altera estado do cupom para (Falha de Captcha)
          if(err.match(/Captcha/)) cupom.estado = 'captcha erro';

          //Atualiza cupom no banco
          Cupom.updateCupom(cupom).then(result =>{

            //Envia resposta se primeira iteração
            if(first){
              res.status(412).send(err);
              first = false;
            }

          });
        });
      });
    //Erro geral
  }).catch(err =>{res.status(412).send(err)});
  });

//Metodos para a rota /chave
router.route('/chave')

  //POST (Inseri) o captcha e registra cupons
  .post(function(req, res){

    //Primeira Iteração
    var first = true;

    //Inseri o valor do Captcha
    Navigator.setCaptcha(req.body.valor);

    Chave.selectChave().then(chaves => {

      //Todas as Chaves ja Cadastrados
      if(!chaves[0]) res.json('OK');

      chaves.forEach(chave => {

        //Salva chave no site da receita
        Navigator.registerChave(chave).then(result =>{

          //Altera estado do cupom para 1 (Sucesso)
          chave.estado = 'cadastrado';

          //Atualiza cupom no banco
          Chave.updateChave(chave).then(result =>{

            //Envia resposta se primeira iteração
            if(first){
              res.json(result);
              first = false;
            }
          });
        }).catch(err => {

          //Altera estado da chave para (Falha de Cadastro)
          chave.estado = 'cadastro erro';

          //Altera estado da chave para (Falha de Captcha)
          if(err.match(/Captcha/)) chave.estado = 'captcha erro';

          //Atualiza chave no banco
          Chave.updateChave(chave).then(result =>{

            //Envia resposta se primeira iteração
            if(first){
              res.status(412).send(err)
              first = false;
            }

          });
        });
      });
    //Erro geral
    }).catch(err =>{res.status(412).send(err)});
  });

//Metodos para a rota /captcha
router.route('/captcha')

  //GET (Seleciona) a URL do Captcha
  .get(function(req, res){

    //Retorna URL do captcha
    Navigator.getCaptcha().then(result =>{

      res.json(result);

    //Captcha já Resolvido
  }).catch(err =>{res.status(404).send('No Captcha')});
  });

//Metodos para a rota /captcha
router.route('/image/:file')

  //GET (Seleciona) a imagem do captcha
  .get(function(req, res){

    //Node do Arquivo
    var file = req.params.file;

    //Opções de Envio
    var options = {
      root: __dirname + '/../image/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    //Envio do Arquivo (Imagem)
    res.sendFile(file, options, function(err){

      //Erro no Envio
      if(err) res.status(err.status).end();
    });
  });

//Exporting Routes
module.exports = router;
