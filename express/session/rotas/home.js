/**
 * Created by mathias on 22/07/17.
 */

const {RotaPrincipal} = require('../../../respostas/principal');
module.exports = function (app) {

    app.all('/', (req, res) =>{
        // RotaPrincipal(retorno =>{
        //   if(retorno.sucesso){
        //       res.json(retorno.dados);
        //   } else {
        //       res.send(`Erro ao listar: ${retorno.erro}`);
        //   }
        // });
        if(req.session.numero){
            req.session.numero++;
        } else {
            req.session.numero = 1;
        }
        res.send(`Numero Aleatório ${Math.random()} e incremento: ${req.session.numero}`);
    });

};

/**
 if(req.session.numero){
            req.session.numero++;
        } else {
            req.session.numero = 1;
        }
 res.send(`Numero Aleatório ${Math.random()} e incremento: ${req.session.numero}`);
 */