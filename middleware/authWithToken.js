const jwt = require('jsonwebtoken');
const JWTSecret = 'ID68(@WCPw|uzY5*';

function authToken(req, res, next) {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({ err: 'Token não fornecido' });
    }

    const token = bearerToken.split(' ')[1];

    if (!token) {
        return res.status(401).json({ err: 'Token inválido' });
    }

    jwt.verify(token, JWTSecret, (err, data) => {
        if (err) {
            return res.status(401).json({ err: 'Token inválido' });
        }

        const { id, email } = data;

        req.token = token;

        req.loggedUser = {
            id,
            email,
        };

        return next();
    });
}

module.exports = {
    authToken,
    JWTSecret
}
