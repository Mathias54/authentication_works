/**
 * Created by mathias on 22/07/17.
 */

const {RotaPrincipal} = require('../../../respostas/principal');

module.exports = function (app) {

    app.all('/', (req, res) =>{
        RotaPrincipal(retorno =>{
          if(retorno.sucesso){
              res.json(retorno.dados);
          } else {
              res.send(`Erro ao listar: ${retorno.erro}`);
          }
        });
    });

};