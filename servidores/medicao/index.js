const mongodb = require('../bancoDeDados/mongodbConfigs');
const {performance} = require('perf_hooks');
const marcador = performance;
const compararMarks = (nome, p1, p2) => {
    performance.measure(nome, p1, p2);
    mongodb( (error, db) =>{
        if(error)
            console.log(`Erro ao persistir: ${error}`);
        else {
            const resultado = performance.getEntriesByName(nome);
            resultado[(resultado.length -1)]._id = new Date();
            resultado[(resultado.length -1)].tipo = 2;
            db.collection('benchmarks').insertOne(resultado[(resultado.length -1)], (erro, insercao) =>{
                if(erro)
                    console.log(`Erro: ${erro}`);
                else
                    console.log('inserido ', resultado[(resultado.length -1)]);
            });
        }
    });
};

module.exports.marcador = marcador;
module.exports.compararMarks = compararMarks;