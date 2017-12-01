/**
 * Created by mathias on 16/08/17.
 */
const {marcador, compararMarks} = require('../../../medicao/index');

const sessionMiddleware = require('../middleware/sessionMiddleware');
const {RotaDetalheFilme, RotaPerfilUsuario} = require('../../../respostas/principal');

module.exports = function (app) {

    app.get('/filme/:id', sessionMiddleware, (req, res)=>{
        marcador.mark('INI_FILMEID');
        const id = req.params.id;
        RotaDetalheFilme(id, retorno =>{
            if(retorno.sucesso){
                res.json(retorno.dado);
                marcador.mark('FIM_FILMEID');
                compararMarks('FILMEID_EXPRESS_SESSION', 'INI_FILMEIF', 'FIM_FILMEID');
            } else {
                res.send(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    });

    app.get('/perfil/', sessionMiddleware, (req, res)=>{
        marcador.mark('INI_PERFIL');
        const id = req.session.user._id;
        RotaPerfilUsuario(id, retorno =>{
            if(retorno.sucesso){
                res.json(retorno.dado);
                marcador.mark('FIM_PERFIL');
                compararMarks('PERFIL_EXPRESS_SESSION', 'INI_PERFIL', 'FIM_PERFIL');
            } else {
                res.send(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    });
};