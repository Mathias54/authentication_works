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
                request.session.logado = query;
                reply({
                    sucesso: true,
                    mensagem: 'Usuario logado'
                })
            } else {
                reply({
                    sucesso: false,
                    erro: `Erro ocorrido na busca: ${erro}`
                });
            }
        })
        // request.session.logado = true;
        // reply("ok");
    }

};