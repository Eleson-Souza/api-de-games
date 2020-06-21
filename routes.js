const express = require('express');

const GameController = require('./controllers/GameController');
const AuthController = require('./controllers/AuthController');

const authWithToken = require('./middleware/authWithToken');

const routes = express.Router();

/**
 * Rotas para games
 */
routes.get('/games', authWithToken.authToken, GameController.index);

routes.get('/game/:id', authWithToken.authToken, GameController.find);

routes.post('/game', authWithToken.authToken, GameController.create);

routes.delete('/game/:id', authWithToken.authToken, GameController.destroy);

routes.put('/game/:id', authWithToken.authToken, GameController.update);

/**
 * Rotas de autenticacao
 */
// autentificação do usuário (login) utilizando o JWT
routes.post('/auth', /* authToken, */ AuthController.create);

module.exports = routes;
