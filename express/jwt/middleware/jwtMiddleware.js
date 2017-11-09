/**
 * Created by mathias on 17/07/17.
 */
const jwt_key = require('../../../bancoDeDados/servidorConfigs').jwt.key;
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    marcador.mark('INI_MIDDLEWARE');
    const token = req.body.token
        || req.params.token
        || req.headers['x-access-token']
        || req.headers['X-Access-Token']
        || req.headers['authorization']
        || req.headers['token'];

    if (token) {
        jwt.verify(token, jwt_key, (err, decoded) => {
            /**
             * TODO como evitar análise desnecessária.
             */
            if (err) {
                marcador.mark('FIM_MIDDLEWARE');
                compararMarks('MIDDLEWARE_EXPRESS_JWT', 'INI_MIDDLEWARE', 'FIM_MIDDLEWARE');
                return res.status(403).json({
                    sucesso: false,
                    mensagem: 'Seu Token Espirou',
                });
            } else {
                req.sessao = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Você não forneceu um token',
        })
    }
};