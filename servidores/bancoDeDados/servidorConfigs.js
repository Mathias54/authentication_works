/**
 * Created by mathias on 22/07/17.
 */
module.exports = {
    http_porta: 3000,
    https_porta: 443,
    mongodb :{
        servidor: 'localhost',
        senha: 'mathias_regio_roben',
        usuario: 'mathias',
        db: 'admin',
        porta: 27017,
        replicaSet : {
            rs01: '108.61.171.61:5000',
            rs02: '45.77.158.248:4000',
            rs03: '45.77.14.11:3000',
            nome: 'tttv1'
        }
    },
    jwt:{
        key:'tcc_mathias_chave_jwt'
    },
    session:{
        key:'tcc_mathias_chave_session'
    },
    bcrypt: {
        saltRounds: 10,
    }
};