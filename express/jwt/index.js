/**
 * Created by mathias on 22/07/17.
 */

const http = require('http');
const https = require('https');
const app = require('./configuracoes/expressConfigs');
const porta = require('./../../bancoDeDados/servidorConfigs').porta;
const https_porta = require('./../../bancoDeDados/servidorConfigs').portaHttps;
const fs = require('fs');

let options = {
    key  : fs.readFileSync('../../chaves/liberep.key'),
    cert : fs.readFileSync('../../chaves/8b521c56e11f0512.crt'),
    ca: [
        fs.readFileSync('../../chaves/gd_bundle01.crt'),
        fs.readFileSync('../../chaves/gd_bundle02.crt'),
        fs.readFileSync('../../chaves/gd_bundle03.crt')
    ]
};

https.createServer(options, app)
    .listen(https_porta, ()=>{
        console.log(`servidor rodando na porta ${https_porta}`);
    });
