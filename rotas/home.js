/**
 * Created by mathias on 22/07/17.
 */
module.exports = function (app) {

    app.all('/', (req, res) =>{
        res.send('Seja bem-vindo a API. Para acessar os detalhes de filmes você precisa se autenticar');
    });

};