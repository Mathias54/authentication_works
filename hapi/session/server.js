/**
 * Created by mathias on 18/09/17.
 */
'use strict';

const hapi = require('hapi');
const {cadastro_rota, login_rota} = require('./rotas/autenticacao');
const {home_rota} = require('./rotas/home');
const {info_rota, perfil_rota} = require('./rotas/movieDetails');

const server = new hapi.Server();

server.connection({
    host: 'localhost',
    address: '127.0.0.1',
    port: 8000,
});

const hapi_session = {
    register: require('hapi-server-session'),
};

server.register(hapi_session, function (err) {

    if (err) {
        console.log(`Erro ao adicionar o hapi-server-session: ${err}`);
    }


    server.route([
        {
            method: 'GET', path: '/',
            handler: home_rota
        },
        {
            method: 'GET', path: '/filme/{id}',
            handler: info_rota
        },
        {
            method: 'GET', path: '/perfil',
            handler: perfil_rota
        },
        {
            method: 'POST', path: '/cadastro',
            handler: cadastro_rota
        },
        {
            method: 'POST', path: '/login',
            handler: login_rota
        }
    ]);
});

/**
 * TODO não funciona no POSTMAN.
 */

server.start(_=> {
    console.log('Servidor rodando');
});