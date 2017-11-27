/**
 * Created by mathias on 18/09/17.
 */
const {RotaDetalheFilme, RotaPerfilUsuario} = require(__dirname + '/../../../respostas/principal.js');

module.exports = {

    info_rota: (request, reply) => {
        marcador.mark('FIM_FILMEID');
        const id = request.params.id;
        RotaDetalheFilme(id, retorno => {
            if (retorno.sucesso) {
                reply(retorno.dado);
                marcador.mark('FIM_FILMEID');
                compararMarks('FILMEID_HAPI_JWT', 'INI_FILMEIF', 'FIM_FILMEID');
            } else {
                reply(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    },

    perfil_rota: (request, reply) => {
        marcador.mark('INI_PERFIL');
        const id = request.sessao.id;
        RotaPerfilUsuario(id, retorno => {
            if (retorno.sucesso) {
                reply(retorno.dado);
                marcador.mark('FIM_PERFIL');
                compararMarks('PERFIL_HAPI_JWT', 'INI_PERFIL', 'FIM_PERFIL');
            } else {
                reply(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    }

};