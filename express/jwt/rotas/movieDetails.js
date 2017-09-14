/**
 * Created by mathias on 16/08/17.
 */

const express = require('express');
const api = express.Router(); //rota api
const jwt = require('../middleware/jwtMiddleware');

api.get('/privado/:nome', jwt, (req, res)=>{
    const nome = req.params.nome;
    res.send(nome);
});

// api.get('/filme/nome/:nome', (req, res)=>{
//     const nome = req.params.nome;
//     res.send(nome);
// });

// api.get('/filme/ator/:nome', (req, res)=>{
//     const nome = req.params.nome;
//     res.send(nome);
// });
//
// api.get('/filme/genero/:genero', (req, res)=>{
//     const genero = req.params.genero;
//     res.send(genero);
// });
//
// api.get('/filme/ano/:ano', (req, res)=>{
//     const ano = req.params.ano;
//     res.send(ano);
// });

module.exports = api;