/**
 * Created by mathias on 16/09/17.
 */
const {isValidUser, cadastrarUser} = require('../../../bancoDeDados/User');

module.exports = (app) =>{

    app.post('/login', function (req, res) {

        marcador.mark('INI_LOGIN');

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
                marcador.mark('FIM_LOGIN');
                compararMarks('LOGIN_EXPRESS_SESSION', 'INI_LOGIN', 'FIM_LOGIN');
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: `Erro ocorrido na busca: ${erro}`
                });
            }
        });
    });

    app.post('/cadastro', (req, res)=>{

        marcador.mark('INI_CADASTRO');

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
                marcador.mark('FIM_CADASTRO');
                compararMarks('CADASTRO_EXPRESS_SESSION', 'INI_CADASTRO', 'FIM_CADASTRO');
            } else {
                res.status(400).json({
                    sucesso: false,
                    erro: erro
                });
            }
        });
    });
};