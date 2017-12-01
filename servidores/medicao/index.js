const mongodb = require('../bancoDeDados/mongodbConfigs');
const {performance} = require('perf_hooks');
const marcador = performance;
const compararMarks = function (nome, p1, p2) {
    performance.measure(nome, p1, p2);
    mongodb( (error, db) =>{
        if(error)
            console.log(`Erro ao persistir: ${error}`);
        else {
            const resultado = performance.getEntriesByName(nome);
            resultado[0]._id = new Date();
            db.collection('benchmarks').insertOne(resultado[0], (erro, insercao) =>{
                if(erro)
                    console.log(`Erro: ${erro}`);
                else
                    console.log('inserido ', resultado[0]);
            });
        }
    });
};

module.exports.marcador = marcador;
module.exports.compararMarks = compararMarks;