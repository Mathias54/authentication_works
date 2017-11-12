/**
 * Created by mathias on 16/09/17.
 */
const { performance } = require('perf_hooks');
global.marcador = performance;
global.compararMarks = function (nome, p1, p2) {
    performance.measure(nome, p1, p2);
    console.log(performance.getEntriesByName(nome));
    // TODO persistir banco de dados o resultado.... analisar....
};

const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./configuracoes/expressConfigs');
const {http_porta, https_porta} = require('./../../bancoDeDados/servidorConfigs');
const executarHttps = process.argv[2] === 'https';

module.exports = function () {
    if(executarHttps){
        let options = {
            key: fs.readFileSync(__dirname + '/../../chaves/liberep.key'),
            cert: fs.readFileSync(__dirname + '/../../chaves/8b521c56e11f0512.crt'),
            ca: [
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle01.crt'),
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle02.crt'),
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle03.crt')
            ]
        };
        https.createServer(options, app)
            .listen(https_porta, ()=>{
                console.log(`servidor HTTPS rodando na porta ${https_porta}`);
            });
    }

    http.createServer(app)
        .listen(http_porta, ()=>{
            console.log(`servidor HTTP rodando na porta ${http_porta}`);
        });
};