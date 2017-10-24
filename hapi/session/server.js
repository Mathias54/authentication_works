/**
 * Created by mathias on 18/09/17.
 */
'use strict';

const hapi = require('hapi');
const {cadastro_rota, login_rota} = require('./rotas/autenticacao');
const {home_rota} = require('./rotas/home');
const {info_rota, perfil_rota} = require('./rotas/movieDetails');
const {portaHttps, porta} = require('../../bancoDeDados/servidorConfigs');
const fs = require('fs');

const server = new hapi.Server();

let options = {
    key  : fs.readFileSync('../../chaves/liberep.key'),
    cert : fs.readFileSync('../../chaves/8b521c56e11f0512.crt'),
    ca: [
        fs.readFileSync('../../chaves/gd_bundle01.crt'),
        fs.readFileSync('../../chaves/gd_bundle02.crt'),
        fs.readFileSync('../../chaves/gd_bundle03.crt')
    ]
};


server.connection({port: porta});

server.connection({port: portaHttps, tls: options});

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