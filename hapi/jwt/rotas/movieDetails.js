/**
 * Created by mathias on 18/09/17.
 */
const {RotaDetalheFilme, RotaPerfilUsuario} = require('../../../respostas/principal');

module.exports = {

    info_rota: (request, reply) => {
        const id = request.params.id;
        RotaDetalheFilme(id, retorno => {
            if (retorno.sucesso) {
                reply(retorno.dado);
            } else {
                reply(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    },

    perfil_rota: (request, reply) => {
        const id = request.sessao.id;
        RotaPerfilUsuario(id, retorno => {
            if (retorno.sucesso) {
                reply(retorno.dado);
            } else {
                reply(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    }

};