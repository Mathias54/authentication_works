/**
 * Created by mathias on 15/08/17.
 */
/**
 * Created by mathias on 22/07/17.
 */
const mongodb = require('../configuracoes/mongodbConfigs');
const jwt = require('jsonwebtoken');
const jwt_key = require('../configuracoes/servidorConfigs').jwt.key;

module.exports =  (app) => {

    app.post('/login', (req, res)=>{
        const login = req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario;
        const senha = req.body.password || req.body.senha;
        /**
         * TODO fazer validação do usuario
         */
        console.log(login);
        mongodb((erro, db)=>{
            db.collection('usuario').findOne({ usuario: login }, (erro, user)=>{
                console.log(user);
                if(!erro && user){
                    if(user.senha === senha){
                        res.status(200).json({
                            sucesso: true,
                            token: jwt.sign(user, jwt_key)
                            /**
                             * TODO gerar token apenas se não foi gerado anteriormente
                             */
                        });
                    } else {
                        res.status(400).json({
                            sucesso: false,
                            erro: 'Usuário ou Senha incorretos'
                        });
                    }
                } else {
                    res.status(400).json({
                        sucesso: false,
                        erro: 'Usuário ou Senha incorretos'
                    });
                }
            });
        })
    });

    app.post('/cadastro', (req, res)=>{
        /**
         *
         * TODO fazer verificação de senha apenas depois que encontrar o usuário
         */
        const query = {
            usuario: req.body.login || req.body.email || req.body.nome || req.body.user || req.body.name || req.body.usuario,
            senha: req.body.password || req.body.senha
        };
        /**
         * TODO fazer criptografia da senha
         */
        mongodb((erro, db)=>{
            db.collection('usuario').insertOne(query, (erro, usuario) =>{
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
            })
        })
    });

};