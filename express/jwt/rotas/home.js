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
              compararMarks('HOME', 'INI_HOME', 'FIM_HOME');

          } else {
              res.send(`Erro ao listar: ${retorno.erro}`);
          }
        });
    });

};