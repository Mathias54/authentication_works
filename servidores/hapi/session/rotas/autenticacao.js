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
        console.log(query);

        cadastrarUser(query, (erro, resultado) => {
            if (!erro) {
                reply({
                    sucesso: true,
                    usuario: query
                });
                marcador.mark('FIM_CADASTRO');
                compararMarks('CADASTRO_HAPI_SESSION', 'INI_CADASTRO', 'FIM_CADASTRO');
            } else {
                reply({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    },

    login_rota: (request, reply)=> {
        marcador.mark('INI_LOGIN');
        const query = {
            usuario: request.payload.login || request.payload.email || request.payload.nome || request.payload.user || request.payload.name || request.payload.usuario,
            senha: request.payload.password || request.payload.senha
        };
        isValidUser(query, (erro, user) => {
            if (!erro && user) {
                request.session.user = user;
                request.session.logado = true;
                reply({
                    sucesso: true,
                    mensagem: 'Usuario logado'
                });
                marcador.mark('FIM_LOGIN');
                compararMarks('LOGIN_HAPI_SESSION', 'INI_LOGIN', 'FIM_LOGIN');
            } else {
                reply({
                    sucesso: false,
                    erro: `Erro ocorrido na busca: ${erro}`
                });
            }
        })
    }

};