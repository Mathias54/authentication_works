/**
 * Created by mathias on 05/09/17.
 */
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017/tcc_mathias';
const dbconnection = require('./mongodbConfigs');
const {saltRounds} = require('./servidorConfigs').bcrypt.saltRounds;
const bcrypt = require('bcryptjs');

/**
 *
 * @param User {Object}
 * @param callback {Function}
 */
const isValidUser = function (User, callback) {
    dbconnection((erro, db) => {
        if (!erro) {
            db.collection('usuario').findOne({usuario: User.usuario}, (erro, user) => {
                if (!erro && user) {
                    bcrypt.compare(User.senha, user.senha, function(err, res) {
                        if(!err){
                            if(res) {
                                callback(false, user);
                            } else {
                                callback(`Erro ao comprar senhas: ${res}`, null)
                            }
                        } else {
                            callback(`Erro na descriptografia: ${err}`)
                        }
                    });
                } else {
                    callback(`Erro na busca do usuario: ${erro}`, null);
                }
            });
        } else {
            callback(`Erro na conexão com o banco: ${erro}`, null);
        }
    });
};

/**
 *
 * @param User {Object}
 * @param callback {Function}
 */
const cadastrarUser = function (User, callback) {
    /**
     * Todo
     * 1) Validar Usuario
     * 2) Verificar se não existe esse usuário no banco de dados
     */
    // console.log(User);
    // bcrypt.hash(User.senha, saltRounds, (err, hash) => {
    //
    // });
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if(!err){
            bcrypt.hash(User.senha, salt, (err, hash) => {
                if(!err){
                    User.senha = hash;
                    dbconnection((erro, db) => {
                        if(!erro){
                            db.collection('usuario').insertOne(User, (erro, resultado) => {
                                if (!erro) {
                                    callback(false, resultado);
                                } else {
                                    callback(`Erro ao inserir ${erro}`, null);
                                }
                            });
                        } else{
                            callback(`Erro na conexão com o banco: ${erro}`, null);
                        }
                    })
                } else {
                    callback(`Erro na criptografia da senha: ${err} `, null);
                }
            });
        } else{
            callback(`Erro na criptografia da senha: ${err} `, null);
        }
    });
};


module.exports = {
    isValidUser,
    cadastrarUser,
};

// isValidUser({"login":"kataliny", "senha":"123"}, (erro, usuario) => {
//     console.log(erro);
//     console.log(usuario)
// });