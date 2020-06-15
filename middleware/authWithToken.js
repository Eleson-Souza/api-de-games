const jwt = require('jsonwebtoken');
const JWTSecret = 'ID68(@WCPw|uzY5*';

function authToken(req, res, next) {
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    
    if(token) {
        jwt.verify(token, JWTSecret, (err, data) => {
            if(err) {
                res.status(401);
                res.json({err: 'Token inválido!'});
            } else {
                req.token = token;
                req.loggedUser = {
                    id: data.id,
                    email: data.email
                };
                next();
            }
        });
    } else {
        res.status(401);
        res.json({err: 'Token inválido!'});
    }
}

module.exports = {
    authToken,
    JWTSecret
}