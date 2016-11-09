//Servico de Navegação
//Navega no Site da Receita

//Modulo Selenium
var webdriver = require('selenium-webdriver');

//Elementos uteis do selenium
var By        = webdriver.By;
var until     = webdriver.until;
var Key       = webdriver.Key;

//Verifica se esta sendo cadastrada uma chave
var isKey = false;

//Pagina Web
var page  = 'https://www.nfp.fazenda.sp.gov.br/';

//Captcha a ser resolvido
var captcha = '';

//Cria um novo chromedriver (Navegador)
//var driver = new webdriver.Builder().forBrowser('chrome').build();//Google Chrome
var driver = new webdriver.Builder().forBrowser('phantomjs').build();//Navegador Fantasma

//Direciona para a tela de login
driver.get(page + 'login.aspx');

//Formata uma data para o formato brasileiro
var _formatDate = function(date){

  //Separa dia, mês e ano
  var day   = (date.getDate()<10? '0' + date.getDate(): date.getDate()).toString();
  var month = ((date.getMonth() + 1)<10? '0' + (date.getMonth() + 1): (date.getMonth() + 1)).toString();
  var year  = date.getFullYear().toString();

  //String formatada
  return day + month + year;
}

//Direciona-se para a tela de registro de cupons
var _toCupomRegister = function(usuario){

  //Cria uma Promessa
  var defer = Promise.defer();

  //Tela login
  driver.wait(until.elementLocated(By.xpath('//*[@id="UserName"]')));
  driver.findElement(By.xpath('//*[@id="UserName"]')).sendKeys(usuario.cpf);
  driver.findElement(By.xpath('//*[@id="Password"]')).sendKeys(usuario.senha);
  driver.findElement(By.xpath('//*[@id="Login"]')).click();

  //Espera a pagina principal
  driver.wait(until.elementLocated(By.xpath('//*[@id="menuSuperior"]/ul/li[4]/a')));

  //Redireciona ate tela de entidade
  driver.get(page + 'EntidadesFilantropicas/CadastroNotaEntidadeAviso.aspx');

  //Pagina do 'prosseguir'
  driver.wait(until.elementLocated(By.xpath('//*[@id="ctl00_ConteudoPagina_btnOk"]')));
  driver.findElement(By.xpath('//*[@id="ctl00_ConteudoPagina_btnOk"]')).click();

  //escolhendo entidade
  driver.wait(until.elementLocated(By.xpath('//*[@id="ddlEntidadeFilantropica"]/option[2]')));
  driver.findElement(By.xpath('//*[@id="ddlEntidadeFilantropica"]/option[2]')).click();
  driver.findElement(By.xpath('//*[@id="ctl00_ConteudoPagina_btnNovaNota"]')).click();

  //Pagina de cadastro - confirmar 'DIV'
  driver.wait(until.elementLocated(By.xpath('//*[@id="divPerguntaMaster"]')), 5000).then(function(){
      driver.wait(until.elementLocated(By.xpath('//*[@id="ConteudoPrincipal"]/div[2]')));
      driver.findElement(By.xpath('/html/body/div[4]/div[11]/div/button[1]/span')).click();
      driver.findElement(By.xpath('/html/body/div[4]/div[11]/div/button[1]/span')).click();

      //Resolve Promessa
      defer.resolve('OK');

  //Possiveis erros do 'DIV'
  }).catch(err =>{

    //Rejeita Promessa
    defer.reject(err);
  });

  //Desce para o final da pagina
  driver.executeScript('scroll(0,1000)');

  //Retorna Promessa
  return defer.promise;
}

//Salva um cupom Cadastrado
var _saveCupom = function(){

  //Cria uma promessa
  var defer = Promise.defer();

  //Salvar Cupom
  driver.findElement(By.xpath('//*[@id="btnSalvarNota"]')).sendKeys(Key.ENTER).then(function(){

    //Erro com 'DIV'
    driver.findElement(By.xpath('//*[@id="lblErroMaster"]')).getText().then(function(innerHtml){

      //Rejeita Promessa
      if(innerHtml) defer.reject(innerHtml.replace(/\n\n\n\(Pressione ESC para fechar mensagem\)/,""));

      //Sair da Erro
      driver.findElement(By.xpath('/html/body/div[3]/div[11]/div/button/span')).click();

    //Erro sem 'DIV'
    }).catch(err =>{

      //Erro Mensagem
      driver.findElement(By.xpath('//*[@id="lblErro"]')).getText().then(function(innerHtml){

      //Rejeita Promessa
      defer.reject(innerHtml);
      });

    //Cadastro com Sucesso
    }).catch(err =>{

      //Resolve Promessa
      defer.resolve('OK');

      //Representa apenas sucesso no cadastro e não na doação
    });
  }).catch(err =>{console.log('Botão Salvar \n\n' + err + '\n\n')});

  _clearFields();

  //Retorna uma promessa
  return defer.promise;
}

//Limpa dados de cadastro
var _clearFields = function(){

  //Cria uma Promessa
  var defer = Promise.defer();

  driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).clear().catch(err =>{});

  //Desce para o final da pagina
  driver.executeScript('scroll(0,1000)');

  //Se é um cupom, limpa:
  if(!isKey) driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).clear()//CNPJ
              .then(driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).clear())//DATA
              .then(driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).clear())//COO
              .then(driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).clear())//VALOR
              .then(function(){

                driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(Key.BACK_SPACE);
                defer.resolve('OK');
              }).catch(err =>{defer.reject(err)});

  //Se é uma chave, limpa:
  if (isKey) driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).clear()//CHAVE
              .then(function(){

                //Finish Clearing the Chave Input
                driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).sendKeys(Key.BACK_SPACE);

                //Resolve a promessa
                defer.resolve('OK')
              }).catch(err =>{defer.reject(err)});

  //Retorna uma promessa
  return defer.promise;
}

//Retorna o Captcha para ser resolvido
var _getCaptcha = function(){

  //Cria uma promessa
  var defer = Promise.defer();

  //Endereço
  var address = 'http://localhost:8000';

  driver.findElement(By.xpath('//*[@id="captchaNFP"]')).then(urlCaptcha =>{

    //Captura tela (Captcha)
    driver.takeScreenshot().then(image =>{

      //Salva foto em arquivo
      require('fs').writeFile('./image/captcha.png', image, 'base64', function(err){

        //Erro de Escrita
        if(err) defer.reject(err);

        //Resolve Promessa com endereço da imagem
        else defer.resolve(address + '/image/captcha.png');
      });

      //Erro de Captura
    }).catch(err =>{defer.reject(err)});

  //Captcha não existe
  }).catch(err => {defer.reject(err);});


  //Retorna a promessa
  return defer.promise;
}

//Inseri informação do captcha
var _setCaptcha = function(valor){
  captcha = valor || captcha;
}

//Registra um cupom
var _registerCupom = function(cupom){

  //Esta sendo cadastrado um cupom
  isKey = false;

  //Cria uma Promessa
  var defer = Promise.defer();

  //formata data do cupom
  cupom.data = _formatDate(cupom.data);

  //Espera o carregamento do formulario
  driver.wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input'))).then(function(){

    //Espera 1 segundo para recarregamento
    driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch(err=>{});

    //Inserção das informações do cupom
    driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(cupom.cnpj);//CNPJ
    driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).sendKeys(cupom.data);//DATA
    driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).sendKeys(cupom.coo);//COO
    driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(cupom.valor);//VALOR
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(captcha).catch(err =>{});//CAPTCHA

    //Salva cupom no site
    _saveCupom().then(result =>{

      //Após o envio limpa os campos
      _clearFields().then(result =>{

        //Retorna um cadastro com Sucesso
        defer.resolve(result);

      }).catch(err =>{});

    }).catch(err =>{

      //Após o envio limpa os campos
      _clearFields().then(result =>{

        //Retorna um cadastro com Falha
        defer.reject(err);

      }).catch(err =>{});

    });
  });

  //Retorna uma promessa
  return defer.promise;
}

//Registra uma chave
var _registerChave = function(chave){

  //Esta sendo cadastrada uma chave
  isKey = true;

  //Cria uma Promessa
  var defer = Promise.defer();

  //Espera o carregamento do formulario
  driver.wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input'))).then(function(){

    //Espera 0.2 segundo para recarregamento
    driver.wait(until.elementLocated(By.xpath('Weird')), 200).catch(err=>{});

    //Limpa o campo da chave
    driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).clear();

    //Inseri Informações da chave
    driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).sendKeys(chave.valor);//CHAVE
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(captcha).catch(err =>{});//CAPTCHA

    //Salva cupom no site
    _saveCupom().then(result =>{

      //Após o envio limpa os campos
      _clearFields().then(result =>{

        //Retorna um cadastro com Sucesso
        defer.resolve(result);

      }).catch(err =>{});

    }).catch(err =>{

      //Após o envio limpa os campos
      _clearFields().then(result =>{

        //Retorna um cadastro com Falha
        defer.reject(err);

      }).catch(err =>{});
    });
  });

  _clearFields();

  //Retorna uma promessa
  return defer.promise;
}

//Fecha o navegador
var _closeBrowser = function(){

  //Cria uma Promessa
  var defer = Promise.defer();

  driver.quit().then(result =>{defer.resolve('OK')})
               .catch(err =>{defer.reject(err)});

  return defer.promise;
}

//Funções a serem exportadas (Usadas por outros arquivos)
module.exports = {

  toCupomRegister : _toCupomRegister,
  registerCupom   : _registerCupom,
  registerChave   : _registerChave,
  getCaptcha      : _getCaptcha,
  setCaptcha      : _setCaptcha,
  closeBrowser    : _closeBrowser
}
