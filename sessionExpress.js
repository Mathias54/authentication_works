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
const url = 'mongodb://localhost:27017/testdb';
const app = express();

const store = new MongoDBStore(
    {
        uri: url,
        collection: 'mySessions'
    });

app.use(cookieParser());
// app.use(session({secret: "Shh, its a secret!"}));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(session({
    secret: 'This is a secret',
    cookie: {
        maxAge: 100000
    },
    store: store,
    resave: true,
    saveUninitialized: true,
    autoRemove: 'native'
}));

app.post('/login', function (req, res) {
    const login = req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario;
    const senha = req.body.password || req.body.senha;
    /**
     * TODO fazer validação do usuario
     */
    console.log(login);
    mongodb.connect( url, function (erro, db) {
        db.collection('usuario').findOne({ usuario: login }, function (erro, user){
            console.log(user);
            if(!erro && user){
                if(user.senha === senha){
                    req.session.user = true;
                    res.status(200).json({
                        sucesso: true,
                        mensagem: 'seja bem-vindo'
                    });
                } else {
                    res.status(400).json({
                        sucesso: false,
                        erro: 'Usuário ou Senha incorretos'
                    });
                }
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Usuário ou Senha incorretos'
                });
            }
        });
    })
});

app.get('/teste', function(req, res){
    if(req.session.user){
        res.send("seja bem-vindo a pagina de testes");
    } else {
        res.send("você não tem acesso aqui");
    }
});


app.listen(3001, function () {
    console.log('servidor rodando');
});