/**
 * Created by mathias on 16/08/17.
 */
const sessionMiddleware = require('../middleware/sessionMiddleware');
const {RotaDetalheFilme, RotaPerfilUsuario} = require('../../../respostas/principal');

module.exports = function (app) {
    app.get('/filme/:id', sessionMiddleware, (req, res)=>{
        const id = req.params.id;
        RotaDetalheFilme(id, retorno =>{
            if(retorno.sucesso){
                res.json(retorno.dado);
            } else {
                res.send(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    });

    app.get('/perfil/', sessionMiddleware, (req, res)=>{
        const id = req.session.user._id;
        RotaPerfilUsuario(id, retorno =>{
            if(retorno.sucesso){
                res.json(retorno.dado);
            } else {
                res.send(`Erro ao listar detalhes do filme: ${retorno.erro}`);
            }
        });
    });
};