/**
 *  1) Rota principal para todos, uma home do site. (Listar o título dos filmes)
 *  2) Visualizar perfil do usuario.
 *  3) Acessar detalhes dos filmes
 */

const dbconnection = require('../bancoDeDados/mongodbConfigs');
const ObjectID = require('mongodb').ObjectID;

/**
 *
 * @param callback{Function}
 * @constructor
 */
function RotaPrincipal(callback) {
    dbconnection((erro, db)=>{
        if (!erro){
            db.collection('movieDetails').find({}, {title:1, poster: 1})
                .limit(100)
                .toArray((erro, dados)=>{
                    if(!erro){
                        db.close();
                        callback({
                            sucesso: true,
                            dados: dados
                        })
                    } else {
                        db.close();
                        callback({
                            sucesso: false,
                            erro: `Erro ao listar filmes: ${erro}`
                        })
                    }
            });
        } else {
            callback({
                sucesso: false,
                erro: `Erro ao conectar com o banco de dados: ${erro}`
            })
        }
    });
}

/**
 * Pega detalhes de um filme especifico
 * @param id{String} - Id do filme
 * @param callback{Function} - Funcao de retorno
 * @constructor
 */
function RotaDetalheFilme(id, callback) {
    dbconnection((erro, db)=>{
        if (!erro){
            db.collection('movieDetails').findOne({"_id": new ObjectID(id)}, (erro, dado)=>{
                if(!erro && dado !== null){
                    db.close();
                    callback({
                        sucesso: true,
                        dado: dado
                    })
                } else {
                    db.close();
                    callback({
                        sucesso: false,
                        erro: `Erro na busca do filme: ${erro}`
                    });
                }
            });
        } else {
            callback({
                sucesso: false,
                erro: `Erro ao conectar com o banco de dados: ${erro}`
            });
        }
    })
}

/**
 *
 * @param id{String}
 * @param callback{Function}
 * @constructor
 */
function RotaPerfilUsuario(id, callback) {
    dbconnection((erro, db)=>{
        if (!erro){
            db.collection('usuario').findOne({"_id": new ObjectID(id)}, (erro, dado)=>{
                if(!erro){
                    delete dado.senha;
                    db.close();
                    callback({
                        sucesso: true,
                        dado: dado
                    })
                } else {
                    db.close();
                    callback({
                        sucesso: false,
                        erro: `Erro na busca do usuario: ${erro}`
                    })
                }
            });
        } else {
            callback({
                sucesso: false,
                erro: `Erro ao conectar com o banco de dados: ${erro}`
            })
        }
    })
}

// RotaPrincipal(retorno => {
//     if(retorno.erro){
//         console.log(retorno.erro);
//     } else{
//         console.log(retorno.dados.length);
//     }
// });

// RotaDetalheFilme('5692a13d24de1e0ce2dfcec2', retorno =>{
//     if(retorno.erro){
//         console.log(retorno.erro);
//     } else{
//         console.log(retorno.dado);
//     }
// });

// RotaPerfilUsuario('569190ca24de1e0ce2dfcd4f', retorno =>{
//     if(retorno.erro){
//         console.log(retorno.erro);
//     } else{
//         console.log(retorno.dado);
//     }
// });

module.exports = {RotaPerfilUsuario, RotaPrincipal, RotaDetalheFilme};