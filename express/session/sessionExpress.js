/**
 * Created by mathias on 04/09/17.
 * exemplo isolado para session com express
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const mongodb = require('./configuracoes/mongodbConfigs');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongodb = require('mongodb').MongoClient;
const bodyparser = require('body-parser');
const url = 'mongodb://localhost:27017/tcc_mathias';
const app = express();
const {isValidUser, comparePasswordAndUser} = require('./../../bancoDeDados/User');

app.use(cookieParser());
// app.use(session({secret: "Shh, its a secret!"}));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(session({
    secret: 'This is a secret',
    cookie: {
        maxAge: 100000
    },
    store: new MongoDBStore({
        uri: url,
        collection: 'mySessions'
    }),
    resave: true,
    saveUninitialized: true,
    autoRemove: 'native'
}));

function middlewareSession(req, res, next) {
    if(req.session.user){
        next();
    } else {
        res.send("você não tem acesso aqui");
    }
}

app.post('/login', function (req, res) {

    const login = req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario;
    const senha = req.body.password || req.body.senha;

    isValidUser(login, function (erro, user) {
        if(erro){
            res.status(400).json({
                sucesso: false,
                erro: 'Usuário ou Senha incorretos'
            });
        } else {
            comparePasswordAndUser(user, senha, function (erro) {
                if(erro){
                    res.status(400).json({
                        sucesso: false,
                        erro: 'Usuário ou Senha incorretos'
                    });
                } else {
                    req.session.user = true;
                    res.status(200).json({
                        sucesso: true,
                        mensagem: 'seja bem-vindo'
                    });
                }
            });
        }
    })
});

app.get('/teste', middlewareSession, function(req, res){
    res.send("seja bem-vindo a pagina de testes");
});


app.listen(3001, function () {
    console.log('servidor rodando');
});