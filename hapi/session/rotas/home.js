/**
 * Created by mathias on 18/09/17.
 */

const {RotaPrincipal} = require('../../../respostas/principal');

module.exports = {

    home_rota: (request, reply) => {
        RotaPrincipal(retorno => {
            if(retorno.erro){
                console.log(`Erro ao consultar dados para a rota principal: ${retorno.erro}`);
            } else{
                reply(retorno.dados);
            }
        });
    },


};