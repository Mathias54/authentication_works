/**
 * Created by mathias on 22/07/17.
 */
const {marcador, compararMarks} = require('../../../medicao/index');

const jwt = require('jsonwebtoken');
const jwt_key = require('../../../bancoDeDados/servidorConfigs').jwt.key;
const {isValidUser, cadastrarUser} = require('../../../bancoDeDados/User');

module.exports =  (app) => {

    app.post('/login', (req, res)=>{

        marcador.mark('INI_LOGIN');

        const query = {
            usuario: req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario,
            senha: req.body.password || req.body.senha
        };

        isValidUser(query, (erro, user)=>{
            if(!erro && user){
                jwt.sign({id: user._id, usuario: user.usuario}, jwt_key, (erro, token) => {
                    if(!erro){


                        res.status(200).json({
                            sucesso: true,
                            token: token
                            /**
                             * TODO gerar token apenas se não foi gerado anteriormente
                             */
                        });

                        marcador.mark('FIM_LOGIN');
                        compararMarks('LOGIN_EXPRESS_JWT', 'INI_LOGIN', 'FIM_LOGIN');

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

        marcador.mark('INI_CADASTRO');

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

                marcador.mark('FIM_CADASTRO');
                compararMarks('CADASTRO_EXPRESS_JWT', 'INI_CADASTRO', 'FIM_CADASTRO');


            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    });

};