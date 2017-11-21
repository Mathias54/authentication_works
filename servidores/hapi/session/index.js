/**
 * Created by mathias on 18/09/17.
 */
'use strict';
const {performance} = require('perf_hooks');
global.marcador = performance;
global.compararMarks = function (nome, p1, p2) {
    performance.measure(nome, p1, p2);
    console.log(performance.getEntriesByName(nome));
    // TODO persistir banco de dados o resultado.... analisar....
};

const hapi = require('hapi');
const {cadastro_rota, login_rota} = require('./rotas/autenticacao');
const {home_rota} = require('./rotas/home');
const {info_rota, perfil_rota} = require('./rotas/movieDetails');
const {https_porta, http_porta} = require('../../bancoDeDados/servidorConfigs');
const fs = require('fs');
const executarHttps = process.argv[2] === 'https';
const server = new hapi.Server();

module.exports = function () {

    server.connection({port: http_porta});

    if (executarHttps) {
        let options = {
            key: fs.readFileSync(__dirname + '/../../chaves/liberep.key'),
            cert: fs.readFileSync(__dirname + '/../../chaves/8b521c56e11f0512.crt'),
            ca: [
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle01.crt'),
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle02.crt'),
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle03.crt')
            ]
        };
        server.connection({port: https_porta, tls: options});
    }

    const hapi_session = {
        register: require('hapi-server-session'),
        options: {
            cookie: {
                isSecure: false,
            },
        },
    };

    server.register(hapi_session, function (err) {

        if (err) {
            console.log(`Erro ao adicionar o hapi-server-session: ${err}`);
        }

        server.register(require('hapi-cors'), function () {
            if (err) {
                console.log(`Erro ao adicionar o hapi-cors: ${err}`);
            }

            server.register(require('hapi-postman'), function () {
                if (err) {
                    console.log(`Erro ao adicionar o hapi-postoman: ${err}`);
                }

                server.route([
                    {
                        method: 'GET',
                        path: '/',
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
        });
    });

    server.start(_ => {
        console.log('Servidor rodando na porta ', http_porta);
    });
};
