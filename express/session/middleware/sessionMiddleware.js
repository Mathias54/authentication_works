/**
 * Created by mathias on 16/09/17.
 */


module.exports = function middlewareSession(req, res, next) {
    if(req.session.user){
        next();
    } else {
        res.send("você não tem acesso aqui");
    }
};