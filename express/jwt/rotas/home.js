/**
 * Created by mathias on 22/07/17.
 */
module.exports = function (app) {

    app.all('/', (req, res) =>{
        res.send('Rota Principal não autenticada');
    });

};