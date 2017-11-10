/**
 * Created by mathias on 22/07/17.
 */
const MongoClient = require('mongodb').MongoClient;
const mongo_configs = require('./servidorConfigs').mongodb;

let url = `mongodb://${mongo_configs.servidor}:${mongo_configs.porta}/${mongo_configs.db}`;

if(mongo_configs.senha !== ''){
    url = `mongodb://${mongo_configs.usuario}:${mongo_configs.senha}@${mongo_configs.servidor}:${mongo_configs.porta}/${mongo_configs.db}`;
}

/**
 * Função que encapsula a conexão com o MongoDB
 * @param callback (erro, db)
 * @return Function
 */
module.exports = function (callback) {
    MongoClient.connect(url, (err, db) =>{
        callback(err, db);
    });
};