/**
 * Created by mathias on 18/09/17.
 */
const {isValidUser, cadastrarUser} = require(__dirname + '/../../../bancoDeDados/User');
const jwt = require('jsonwebtoken');
const jwt_key = require(__dirname + '/../../../bancoDeDados/servidorConfigs').jwt.key;
const {marcador, compararMarks} = require('../../../medicao/index');

module.exports = {

    cadastro_rota: (request, reply) => {
        marcador.mark('INI_CADASTRO');
        const query = {
            usuario: request.payload.login || request.payload.email || request.payload.nome || request.payload.user || request.payload.name || request.payload.usuario,
            senha: request.payload.password || request.payload.senha
        };

        cadastrarUser(query, (erro, resultado) => {
            if (!erro) {
                reply({
                    sucesso: true,
                    usuario: query
                });
                marcador.mark('FIM_CADASTRO');
                compararMarks('CADASTRO_HAPI_JWT', 'INI_CADASTRO', 'FIM_CADASTRO');
            } else {
                reply({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    },

    login_rota: (request, reply) => {
        marcador.mark('INI_LOGIN');
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
                        marcador.mark('FIM_LOGIN');
                        compararMarks('LOGIN_HAPI_JWT', 'INI_LOGIN', 'FIM_LOGIN');
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