// API REST
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/connection');

const app = express();

const routes = require('./routes');

const cors = require('cors');

// senha secreta para gerar o token.
//const JWTSecret = 'ID68(@WCPw|uzY5*';

// Mecanismo de segurança que quando ativado, bloqueia a utilização externa da API.
// Neste caso, o bloqueio fica desativado.
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(routes);

// Database
connection
    .authenticate()
    .then(() => {
        //console.log('Conexão ao banco realizada com sucesso!');
    })
    .catch((err) => {
        console.log('Ocorreu um erro ao se conectar: ' + err);
    });

const port = 1234;

app.listen(port, () => {
    console.log('API rodando na porta ' + port);
});
