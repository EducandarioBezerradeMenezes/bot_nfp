//Email Service
//Serviço que envia emails

//Modulo de envio de emails
var nodemailer = require('nodemailer');

//Objeto de Transporte para email
var transporter = nodemailer.createTransport('smtps://mateus.oli.car%40gmail.com:picolo12@smtp.gmail.com');

//Informações do email
var mailOptions ={
  from: '"EBM NFP" <mateus.oli.car@gmail.com>', //Email emissor
  to: '',//Email receptor
  subject: 'Recuperação de senha',//Assunto
  html:'<img src="http://www.selosocial.com/upload/participante/logo/280_110/273471e46dbad29f79c3b84b622d241f.png"/>'
        + '<br/>'
        + '<p>',
  text:''
}

//Enviar email
var _sendEmail = function(user){

  //Cria uma promessa
  return new Promise((resolve, reject) => {

    //Enviar para
    mailOptions.to = user.email;

    //Nova senha
    mailOptions.html += 'Bom dia, ' + user.name + '</p><p>Nova Senha: ' + user.password + '</p>';

    //Envia o email para usuario informado
    transporter.sendMail(mailOptions, function(error, info){

      //Erro de envio
      if(error) reject(error);

      //Envio com sucesso
      else resolve(info);
    });
  });
}

//Funções a serem usadas em outros modulos
module.exports = {
  sendEmail: _sendEmail,
}
