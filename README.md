# EMB NFP
## API-Bot que cadastra cupons no site da nota fiscal paulista
<p> Este projeto cria uma API-BOT que tem como objetivo injetar informações no site da nota fiscal paulista a partir de um base de dados e a partir desta injeção disponibilizar informações relevantes aos usuarios do sistema.Utiliza-se a linguagem de programação Javascript e o banco de dados PostgresSQL. Também esta sendo utilizado para a criação do projeto as tecnologias:</p>

  <ul>• Node.js 4.5.0;</ul>

  <ul>• NPM 2.15.9;</ul>

  <ul>• Selenium (versão para node) 3.0.0-beta-3;</ul>

  <ul>• Chrome WebDriver 2.24;</ul>

  <ul>• PG 6.1.0.</ul>

  <ul>• Atom 1.12.0.</ul>

<p> No desenvolvimento deste projeto foi desenvolvido o arquivo "index.js" que deixa a API no ar. Também foram desenvolvidos controllers para a criação das Endpoints da API-BOT, Models para a conexão com a base de dados PostGresSQL e services que possibilitam a navegação dentro do site utilizando o selenium. Dentre os EndPoints criados estão:</p>

  <ul>• "/Captcha":
  (GET) Visualização de fotos dos captchas mostrados pelo site da receita e (POST) o envio dos valores representados por estes captchas para a inserção dos cupons e chaves cadastrados no site da receita; </ul>

  <ul>• "/User":
  (POST) Inserção de novos usuarios que utilizarão o sistema e alteração da senha destes usuarios;</ul>

  <ul>• "/LogIn":
  (PUT) Realização do Log-In verificando as informações enviadas;</ul>

  <ul>• "/Chave":
  (PUT) Informações relevantes relacionadas ao estado de cadastro das chaves;</ul>

  <ul>• "/Cupom":
  (PUT) Informações relevantes relacionadas ao estado de cadastro dos cupons;</ul>

<p> Para inicializar este porjeto (API-BOT) é necessario:</p>

  1. Baixar um dos Web Drivers a seguir:

  <ul>1.1. Chrome  WebDriver: https://sites.google.com/a/chromium.org/chromedriver/downloads;</ul>
  <ul>1.2. Phantom WebDriver: http://phantomjs.org/download.html.</ul>

  2. Colocar a pasta do Web Driver na variavel de sistema PATH;

  3. Baixar os modulos do Node.js: "npm install";

  4. Iniciar a aplicação: "npm start".
