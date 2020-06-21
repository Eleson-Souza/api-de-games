// biblioteca que gera um token após uma autenticação de um login, para garantir maior segurança.
const jwt = require('jsonwebtoken');

const authWithToken = require('../middleware/authWithToken');

const User = require('../models/Users');

/**
 * create: cria um novo game a partir do bosy da requisição
 */
class AuthController {
    async create(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status().json({
                err: 'Email não informado',
                status: res.statusCode
            });
        }

        // busca o email no banco, se estiver correto verifica a senha.
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({
                err: 'Usuário não encontrado',
                status: res.statusCode
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                err: 'Credenciais inválidas!',
                status: res.statusCode
            });
        }

        // Utilizando o JWT após a autentificação. sign({dados que poderão ser acessados posteriormente}, senha para gerar token, tempo de expiração, callback(erro, token)=>{})
        jwt.sign({
            id: user.id,
            email: user.email
        }, authWithToken.JWTSecret, { expiresIn: '48h' }, (err, token) => {
            if (err) {
                res.status(400);
                res.json({ err: 'Falha interna' });
            } else {
                res.status(200);
                res.json({ token: token });
            }
        });
    }
}

module.exports = new AuthController();
