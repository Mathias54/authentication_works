/**
 * Created by mathias on 18/09/17.
 */
/**
 * Created by mathias on 10/09/17.
 * Exemplo de código com o JWT funcionando no Hapi.js
 */

const { performance } = require('perf_hooks');
global.marcador = performance;
global.compararMarks = function (nome, p1, p2) {
    performance.measure(nome, p1, p2);
    console.log(performance.getEntriesByName(nome));
    // TODO persistir banco de dados o resultado.... analisar....
};

const Hapi = require('hapi');
const {cadastro_rota, login_rota} = require('./rotas/autenticacao');
const {home_rota} = require('./rotas/home');
const {info_rota, perfil_rota} = require('./rotas/movieDetails');
const {http_porta, https_porta} = require('./../../bancoDeDados/servidorConfigs');
const fs = require('fs');
const jwt_key = require('../../bancoDeDados/servidorConfigs').jwt.key;
const executarHttps = process.argv[2] === 'https';

const validate = function (decoded, request, callback) {
    /**
     * TODO fazer a marcação no core da Lib.
     */

    request.sessao = decoded;
    return callback(null, true);
};

const server = new Hapi.Server();


server.connection({port: http_porta});

if(executarHttps){
    let options = {
        key  : fs.readFileSync('../../chaves/liberep.key'),
        cert : fs.readFileSync('../../chaves/8b521c56e11f0512.crt'),
        ca: [
            fs.readFileSync('../../chaves/gd_bundle01.crt'),
            fs.readFileSync('../../chaves/gd_bundle02.crt'),
            fs.readFileSync('../../chaves/gd_bundle03.crt')
        ]
    };

    server.connection({port: https_porta, tls: options });
}

server.register(require('hapi-auth-jwt2'), function (err) {

    if (err) {
        console.log(`Erro ao adicionar o hapi-auth-jwt2: ${err}`);
    }

    server.auth.strategy('jwt', 'jwt',
        {
            key: jwt_key,
            validateFunc: validate,
            verifyOptions: {algorithms: ['HS256']}
        });

    server.auth.default('jwt');

    server.route([
        {
            method: "GET", path: "/", config: {auth: false},
            handler:home_rota
        },
        {
            method: 'GET', path: '/filme/{id}', config: {auth: 'jwt'},
            handler: info_rota
        },
        {
            method: 'GET', path: '/perfil', config: {auth: 'jwt'},
            handler: perfil_rota
        },
        {
            method: 'POST', path: '/cadastro',config: {auth: false},
            handler: cadastro_rota
        },
        {
            method: 'POST', path: '/login',config: {auth: false},
            handler: login_rota
        }
    ]);
});

server.start( () => {
    console.log('Servidor Rodando');
});

