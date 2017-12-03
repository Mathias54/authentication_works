/**
 * Created by mathias on 16/08/17.
 */

const {marcador, compararMarks} = require('../../../medicao/index');
const jwt = require('../middleware/jwtMiddleware');
const {RotaDetalheFilme, RotaPerfilUsuario} = require('../../../respostas/principal');

module.exports = function (app) {
    app.get('/filme/:id', jwt, (req, res)=>{
        marcador.mark('INI_FILMEID');
        const id = req.params.id;
        RotaDetalheFilme(id, retorno =>{
            if(retorno.sucesso){
                res.json(retorno.dado);
                marcador.mark('FIM_FILMEID');
                compararMarks('FILMEID_EXPRESS_JWT', 'INI_FILMEID', 'FIM_FILMEID');
            } else {
                res.send(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    });

    app.get('/perfil/', jwt, (req, res)=>{
        marcador.mark('INI_PERFIL');
        const id = req.sessao.id;
        console.log(req.sessao);
        RotaPerfilUsuario(id, retorno =>{
            if(retorno.sucesso){
                res.json(retorno.dado);
                marcador.mark('FIM_PERFIL');
                compararMarks('PERFIL_EXPRESS_JWT', 'INI_PERFIL', 'FIM_PERFIL');
            } else {
                res.send(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    });
};