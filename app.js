// API REST
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/connection');
const Games = require('./models/Games');
const Users = require('./models/Users');
const cors = require('cors');
const authWithToken = require('./middleware/authWithToken');
// biblioteca que gera um token após uma autenticação de um login, para garantir maior segurança.
const jwt = require('jsonwebtoken');

// senha secreta para gerar o token.
//const JWTSecret = 'ID68(@WCPw|uzY5*';

// Mecanismo de segurança que quando ativado, bloqueia a utilização externa da API.
// Neste caso, o bloqueio fica desativado.
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        //console.log('Conexão ao banco realizada com sucesso!');
    })
    .catch((err) => {
        console.log('Ocorreu um erro ao se conectar: ' + err);
    });

// listando todos os games do banco
app.get('/games', authWithToken.authToken, (req, res) => {
    Games.findAll().then((games) => {
        res.json({user: req.loggedUser, games: games});
        res.statusCode = 200;
    });
});

// exibindo game com um id específico
app.get('/game/:id', authWithToken.authToken, (req, res) => {
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);

        // lista de links do HATEOAS
        var HATEOAS = [
            {
                href: `http://localhost:45679/game/${id}`,
                method: "DELETE",
                rel: "delete_game"
            },
            {
                href: `http://localhost:45679/game/${id}`,
                method: "PUT",
                rel: "edit_game"
            },
            {
                href: `http://localhost:45679/game/${id}`,
                method: "GET",
                rel: "get_game"
            },
            {
                href: `http://localhost:45679/games`,
                method: "GET",
                rel: "get_all_games"
            },
        ];

        Games.findByPk(id).then((game) => {
            if(game != undefined) {
                res.json({game, _links: HATEOAS});
            } else {
                res.sendStatus(404);
            }
        });
    }
});

// Criando um novo game a partir dos dados recebidos pelo body na requisição
app.post('/game', authWithToken.authToken, (req, res) => {
    var {title, year, price} = req.body;

    if(isNaN(year) || isNaN(price) || year == '' || price == '' || title == '') {
        res.sendStatus(400);
    } else {
        Games.create({
            title,
            year,
            price
        }).then(() => {
            res.sendStatus(200);
        });
    }
});

// deletando um game a partir do id
app.delete('/game/:id', authWithToken.authToken, (req, res) => {
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        Games.findByPk(id).then((game) => {
            if(game != undefined) {
                Games.destroy({
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(404);
            }
        });
    }
});

// Editando um game a partir do id, com os dados recebidos pelo body na requisição.
app.put('/game/:id', authWithToken.authToken, (req, res) => {
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        Games.findByPk(id).then((game) => {
            if(game != undefined) {

                var {title, year, price} = req.body;

                // Se o valor for definido, irá ser realizado o update.
                if(title != undefined) {
                    Games.update({title: title}, {where: {id: id}});
                }

                if(year != undefined) {
                    Games.update({year: year}, {where: {id: id}});
                }

                if(price != undefined) {
                    Games.update({price: price}, {where: {id: id}});
                }

                res.sendStatus(200);

            } else {
                res.sendStatus(404);
            }
        });
    }
});

// autentificação do usuário (login) utilizando o JWT
app.post('/auth', /* authToken, */ (req, res) => {
    var {email, password} = req.body;

    // se email foi informado (não é indefinido ou nulo)
    if(email) {
        // busca o email no banco, se estiver correto verifica a senha.
        Users.findOne({where: {email: email}}).then(user => {
            if(user) {                
                if(user.password == password) {
                    // Utilizando o JWT após a autentificação. sign({dados que poderão ser acessados posteriormente}, senha para gerar token, tempo de expiração, callback(erro, token)=>{})
                    jwt.sign({
                        id: user.id,
                        email: user.email
                    }, authWithToken.JWTSecret, {expiresIn: '48h'}, (err, token) => {
                        if(err) {
                            res.status(400);
                            res.json({err: 'Falha interna'});
                        } else {
                            res.status(200);
                            res.json({token: token});
                        }
                    });
                } else {
                    res.status(401);
                    res.json({
                        err: 'Credenciais inválidas!', 
                        status: res.statusCode
                    });
                }
            } else {
                res.status(404);
                res.json({
                    err: 'O e-mail enviado não existe na base de dados!', 
                    status: res.statusCode
                });
            }
        });
    } else {
        res.status(400);
        res.json({err: 'O e-mail enviado é inválido!', status: res.statusCode});
    }
});

var port = 1234;
app.listen(port, () => {
    console.log('API rodando na porta ' + port);
});