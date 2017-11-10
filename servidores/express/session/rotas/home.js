/**
 * Created by mathias on 22/07/17.
 */

const {RotaPrincipal} = require('../../../respostas/principal');
module.exports = function (app) {

    app.all('/', (req, res) =>{
        marcador.mark('INI_HOME');
        RotaPrincipal(retorno =>{
          if(retorno.sucesso){
              res.json(retorno.dados);
              marcador.mark('FIM_HOME');
              compararMarks('HOME_EXPRESS_SESSION', 'INI_HOME', 'FIM_HOME');
          } else {
              res.send(`Erro ao listar: ${retorno.erro}`);
          }
        });
        // if(req.session.numero){
        //     req.session.numero++;
        // } else {
        //     req.session.numero = 1;
        // }
        // res.send(`Numero Aleatório ${Math.random()} e incremento: ${req.session.numero}`);
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