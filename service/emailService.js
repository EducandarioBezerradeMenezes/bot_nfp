//Email Service
//Serviço que envia emails

//Modulo de envio de emails
var nodemailer = require('nodemailer');

//Objeto de Transporte para email
var transporter = nodemailer.createTransport('smtps://mateus.oli.car%40gmail.com:picolo12@smtp.gmail.com');
//var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

//Informações do email
var mailOptions ={
  from: '"EBM NFP" <mateus.oli.car@gmail.com>', //Email emissor
  to: '',//Email receptor
  subject: 'Recuperação de senha',//Assunto
  text: 'Nova Senha: '
}

//Enviar email
var _sendEmail = function(user){

  //Cria uma promessa
  var defer = Promise.defer();

  //Enviar para
  mailOptions.to = user.email;

  //Nova senha
  mailOptions.text = mailOptions.text + user.password;

  console.log(mailOptions);

  //Envia o email para usuario informado
  transporter.sendMail(mailOptions, function(error, info){

    //Erro de envio
    if(error) defer.reject(error);

    //Envio com sucesso
    else defer.resolve(info);
  });

  //Retorna promessa
  return defer.promise;
}

//Funções a serem usadas em outros modulos
module.exports = {
  sendEmail: _sendEmail,
}
