const {performance} = require('perf_hooks');
global.marcador = performance;
global.compararMarks = function (nome, p1, p2) {
    // performance.measure(nome, p1, p2);
    // console.log(performance.getEntriesByName(nome));
    // TODO persistir banco de dados o resultado.... analisar....
    console.log('nova requisicao');
};

const express_jwt = require('./servidores/express/jwt');
const koa_jwt = require('./servidores/koa/jwt');
const hapi_jwt = require('./servidores/hapi/jwt');
const express_session = require('./servidores/express/session');
const hapi_session = require('./servidores/hapi/session');
const koa_session = require('./servidores/koa/session');

if(process.argv[2] === 'options'){
    console.log('Opções:');
    console.log('- express session');
    console.log('- express session https');
    console.log('- express jwt');
    console.log('- express jwt https');
    console.log('- hapi session');
    console.log('- hapi session https');
    console.log('- hapi jwt');
    console.log('- hapi jwt https');
    console.log('- koa session');
    console.log('- koa session https');
    console.log('- koa jwt');
    console.log('- koa jwt https');
    return;
}

if(process.argv[2] === 'express'){
    if(process.argv[3] === 'jwt'){
        express_jwt();
    } else if(process.argv[3] === 'session') {
        express_session();
    } else {
        console.log('Autenticação inválida');
    }
} else if(process.argv[2] === 'koa'){
    if(process.argv[3] === 'jwt'){
        koa_jwt();
    } else if(process.argv[3] === 'session') {
        koa_session();
    } else {
        console.log('Autenticação inválida');
    }
} else if(process.argv[2] === 'hapi'){
    if(process.argv[3] === 'jwt'){
        hapi_jwt();
    } else if(process.argv[3] === 'session') {
        hapi_session();
    } else {
        console.log('Autenticação inválida');
    }
} else {
    console.log('Servidor inválido');
}