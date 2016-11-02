# Bot Nota Fiscal Paulista
## Bot que cadastra cupons no site da nota fiscal paulista
<p> Este projeto cria um bot que tem como objetivo injetar informações no site da nota fiscal paulista a partir de um base de dados.Utiliza-se a linguagem de programação Javascript e o banco de dados PostgresSQL. Também esta sendo utilizado para a criação do projeto as tecnologias:</p>

  <ul>• Node.js 4.5.0;</ul>
  <ul>• NPM 2.15.9;</ul>
  <ul>• Selenium (versão para node) 3.0.0-beta-3;</ul>
  <ul>• Chrome WebDriver 2.24;</ul>
  <ul>• PG 6.1.0.</ul>
  <ul>• Atom 1.12.0.</ul>

<p> No desenvolvimento deste projeto foi desenvolvido o arquivo "index.js" que faz a navegação do site da receita utilizando o Selenium. També foi desenvolvido:</p>

  Models:
  <ul>• Cupom.js: conecta-se com uma base de dados PostgreSQL, utilizando o modulo PG do Node.js, fazendo a seleção de todos os cupons cadastrados.</ul>

<p> Para inicializar este porjeto (BOT) é necessario:</p>

  1. Baixar um dos Web Drivers a seguir:

  <ul>1.1. Chrome  WebDriver: https://sites.google.com/a/chromium.org/chromedriver/downloads;</ul>
  <ul>1.2. Phantom WebDriver: http://phantomjs.org/download.html.</ul>

  2. Colocar a pasta do Web Driver na variavel de sistema PATH;

  3. Baixar os modulos do Node.js: "npm install";

  4. Iniciar a aplicação: "npm start".
