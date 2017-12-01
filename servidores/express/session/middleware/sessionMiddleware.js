/**
 * Created by mathias on 16/09/17.
 */

const {marcador, compararMarks} = require('../../../medicao/index');

module.exports = function middlewareSession(req, res, next) {
    marcador.mark('INI_MIDDLEWARE');
    if(req.session.user){
        marcador.mark('FIM_MIDDLEWARE');
        compararMarks('MIDDLEWARE_EXPRESS_SESSION', 'INI_MIDDLEWARE', 'FIM_MIDDLEWARE');
        next();
    } else {
        res.send("você não tem acesso aqui");
    }
};