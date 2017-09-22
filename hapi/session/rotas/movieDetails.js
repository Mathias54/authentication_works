/**
 * Created by mathias on 18/09/17.
 */
const {RotaDetalheFilme, RotaPerfilUsuario} = require('../../../respostas/principal');

module.exports = {

    info_rota: (request, reply) => {
        console.log(request.session.logado);
        if(!request.session.logado){
            return reply('Autenticação necessário para acessar essa rota');
        }
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
        if(!request.session.logado){
            return reply('Autenticação necessário para acessar essa rota');
        }
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