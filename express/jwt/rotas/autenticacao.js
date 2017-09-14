/**
 * Created by mathias on 22/07/17.
 */
const jwt = require('jsonwebtoken');
const jwt_key = require('../../../bancoDeDados/servidorConfigs').jwt.key;

const {isValidUser, cadastrarUser} = require('../../../bancoDeDados/User');

module.exports =  (app) => {

    app.post('/login', (req, res)=>{
        const query = {
            usuario: req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario,
            senha: req.body.password || req.body.senha
        };
        /**
         * TODO fazer validação do usuario
         */
        isValidUser(query, (erro, user)=>{
            if(!erro && user){
                jwt.sign(user, jwt_key, { algorithm: 'RS256' }, (erro, token) => {
                    if(!err){
                        res.status(200).json({
                            sucesso: true,
                            token: token
                            /**
                             * TODO gerar token apenas se não foi gerado anteriormente
                             */
                        });
                    } else {
                        res.status(400).json({
                            sucesso: false,
                            erro: `Erro ocorrido na geração do JWT: ${erro}`
                        });
                    }
                });
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: `Erro ocorrido na busca: ${erro}`
                });
            }
        })
    });

    app.post('/cadastro', (req, res)=>{
        const query = {
            usuario: req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario,
            senha: req.body.password || req.body.senha
        };
        cadastrarUser(query, (erro, resultado)=>{
            if(!erro){
                res.status(200).json({
                    sucesso: true,
                    usuario: query
                });
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    });

};