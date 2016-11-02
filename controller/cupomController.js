//Cupom Controller
//Cria rotas para o cadastro de cupom

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

//Metodos para o root /
router.route('/')

  //Mensagem de boas vindas
  .get(function(req, res){
    res.json('Bem Vindo ao BOT-API!,\n'
          + 'Este projeto tem como objetivo cadastrar cupons fiscais no site da receita federal.');
  });

//Metodos para rota /cupom
router.route('/cupom')

  //GET (Seleciona) estados de cupons
  .get(function(req, res){

    //Retorna estados e suas quantidades
    Cupom.qtdCupom().then(result =>{
      res.json(result);
    }).catch(err =>{res.json(err)});
  })

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
          cupom.estado = 1;

          //Atualiza cupom no banco
          Cupom.updateCupom(cupom).then(result =>{

            //Mensagem de Sucesso
            console.log('Cupom:');
            console.log(cupom);
            console.log(': Cadastrado com sucesso.\n');
            console.log();

            //Envia resposta se primeira iteração
            if(first){
              res.json(result);
              first = false;
            }
          });
        }).catch(err => {

          //Altera estado do cupom para 2 (Falha de Cadastro)
          cupom.estado = 2;

          //Altera estado do cupom para 3 (Falha de Captcha)
          if(err.match(/Captcha/)) cupom.estado = 3;

          //Atualiza cupom no banco
          Cupom.updateCupom(cupom).then(result =>{

            //Mensagem de Erro
            console.error('Cupom:');
            console.error(cupom);
            console.error(': Erro no Cadastro:');
            console.error(err = err.replace(/\n\n\n\(Pressione ESC para fechar mensagem\)/,""));
            console.error();

            //Envia resposta se primeira iteração
            if(first){
              res.json(err);
              first = false;
            }

          });
        });
      });
    //Erro geral
    }).catch(err =>{res.json(err)});
  });

//Metodos para a rota /chave
router.route('/chave')

  //GET (Seleciona) estado das chaves
  .get(function(req, res){

    //Retorna estados e suas quantidades
    Chave.qtdChave().then(result =>{
      res.json(result);
    }).catch(err =>{res.json(err)});
  })

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
          chave.estado = 1;

          //Atualiza cupom no banco
          Chave.updateChave(chave).then(result =>{

            //Mensagem de Sucesso
            console.log('Chave:');
            console.log(chave);
            console.log(': Cadastrada com sucesso.\n');
            console.log();

            //Envia resposta se primeira iteração
            if(first){
              res.json(result);
              first = false;
            }
          });
        }).catch(err => {

          //Altera estado da chave para 2 (Falha de Cadastro)
          chave.estado = 2;

          //Altera estado da chave para 3 (Falha de Captcha)
          if(err.match(/Captcha/)) chave.estado = 3;

          //Atualiza chave no banco
          Chave.updateChave(chave).then(result =>{

            //Mensagem de Erro
            console.error('Chave:');
            console.error(chave);
            console.error(': Erro no Cadastro:');
            console.error(err = err.replace(/\n\n\n\(Pressione ESC para fechar mensagem\)/,""));
            console.error();

            //Envia resposta se primeira iteração
            if(first){
              res.json(err);
              first = false;
            }

          });
        });
      });
    //Erro geral
    }).catch(err =>{
      console.log(err);
      res.json(err)});
  });

//Metodos para a rota /captcha
router.route('/captcha')

  //GET (Seleciona) a URL do Captcha
  .get(function(req, res){

    //Retorna URL do captcha
    Navigator.getCaptcha().then(result =>{

      res.json(result);

    //Captcha já Resolvido
    }).catch(err =>{res.json('No Captcha')});
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
