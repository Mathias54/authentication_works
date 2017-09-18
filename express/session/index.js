/**
 * Created by mathias on 16/09/17.
 */
const http = require('http');
const app = require('./configuracoes/expressConfigs');
const porta = require('./../../bancoDeDados/servidorConfigs').porta;

http.createServer(app)
    .listen(porta, ()=>{
        console.log(`servidor rodando na porta ${porta}`);
    });