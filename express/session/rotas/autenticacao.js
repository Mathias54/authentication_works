/**
 * Created by mathias on 16/09/17.
 */
const {isValidUser, cadastrarUser} = require('../../../bancoDeDados/User');

module.exports = (app) =>{

    app.post('/login', function (req, res) {

        const user = {
            usuario: req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario,
            senha: req.body.password || req.body.senha
        };
        console.log(user);

        isValidUser(user, (erro, user) =>{
            if(!erro && user){
                delete user.senha;
                req.session.user = user;
                res.status(200).json({
                    sucesso: true,
                    mensagem: 'seja bem-vindo'
                });
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: `Erro ocorrido na busca: ${erro}`
                });
            }
        });
    });

    app.post('/cadastro', (req, res)=>{
        const query = {
            usuario: req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario,
            senha: req.body.password || req.body.senha
        };
        cadastrarUser(query, (erro, resultado)=>{
            if(!erro){
                res.status(200).json({
                    sucesso: true,
                    usuario: query
                });
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    });
};