/**
 * Created by mathias on 22/07/17.
 */

const http = require('http');
const app = require('./configuracoes/expressConfigs');
const porta = require('./configuracoes/servidorConfigs').porta;

http.createServer(app)
    .listen(porta, ()=>{
        console.log(`servidor rodando na porta ${porta}`);
    });