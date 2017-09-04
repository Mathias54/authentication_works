/**
 * Created by mathias on 22/07/17.
 */

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/api', require('../rotas/movieDetails'));
app.use(cors());

require('../rotas/home')(app);
require('../rotas/autenticacao')(app);

module.exports = app;
