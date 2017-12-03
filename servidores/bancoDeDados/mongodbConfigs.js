/**
 * Created by mathias on 22/07/17.
 */
const MongoClient = require('mongodb').MongoClient;
const db_conf = require('./servidorConfigs').mongodb;

let url = `mongodb://${db_conf.servidor}:${db_conf.porta}/${db_conf.db}`;

if(db_conf.senha !== ''){
    url = `mongodb://${db_conf.usuario}:${db_conf.senha}@${db_conf.servidor}:${db_conf.porta}/${db_conf.db}`;
}

if(db_conf.replicaSet){
    url = `mongodb://${db_conf.usuario}:${db_conf.senha}@${db_conf.replicaSet.rs01},${db_conf.replicaSet.rs02},${db_conf.replicaSet.rs03}/${db_conf.db}?replicaSet=${db_conf.replicaSet.nome};`
}

/**
 * Função que encapsula a conexão com o MongoDB
 * @param callback (erro, db)
 * @return Function
 */
module.exports = function (callback) {
    MongoClient.connect(url, (err, db) =>{
        if(!err)
            callback(err, db.db('tcc_mathias'));
    });
};