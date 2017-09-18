/**
 * Created by mathias on 18/09/17.
 */
const {isValidUser, cadastrarUser} = require('../../../bancoDeDados/User');
const jwt = require('jsonwebtoken');
const jwt_key = require('../../../bancoDeDados/servidorConfigs').jwt.key;

module.exports = {

    cadastro_rota: (request, reply) => {

        const query = {
            usuario: request.payload.login || request.payload.email || request.payload.nome || request.payload.user || request.payload.name || request.payload.usuario,
            senha: request.payload.password || request.payload.senha
        };
        console.log(query);

        cadastrarUser(query, (erro, resultado) => {
            if (!erro) {
                reply({
                    sucesso: true,
                    usuario: query
                });
            } else {
                reply({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    },

    login_rota: (request, reply)=> {
        const query = {
            usuario: request.payload.login || request.payload.email || request.payload.nome || request.payload.user || request.payload.name || request.payload.usuario,
            senha: request.payload.password || request.payload.senha
        };
        isValidUser(query, (erro, user) => {
            if (!erro && user) {
                jwt.sign({id: user._id, usuario: user.usuario}, jwt_key, (erro, token) => {
                    if (!erro) {
                        reply({
                            sucesso: true,
                            token: token
                            /**
                             * TODO gerar token apenas se não foi gerado anteriormente
                             */
                        });
                    } else {
                        reply({
                            sucesso: false,
                            erro: `Erro ocorrido na geração do JWT: ${erro}`
                        });
                    }
                });
            } else {
                reply({
                    sucesso: false,
                    erro: `Erro ocorrido na busca: ${erro}`
                });
            }
        })
    }

};