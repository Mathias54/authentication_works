/**
 * Created by mathias on 16/09/17.
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongodb = require('mongodb').MongoClient;
const bodyparser = require('body-parser');
const app = express();

app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(session({
    secret: 'This is a secret',
    cookie: {
        maxAge: 100000
    },
    store: new MongoDBStore({
        uri: 'mongodb://localhost:27017/tcc_mathias',
        collection: 'mySessions'
    }),
    resave: true,
    saveUninitialized: true,
    autoRemove: 'native'
}));


require('../rotas/autenticacao')(app);
require('../rotas/movieDetails')(app);
require('../rotas/home')(app);

module.exports = app;