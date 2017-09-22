/**
 * Created by mathias on 12/09/17.
 */

const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const { promisify } = require('util');
const koaBody = require('koa-body');

app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

const RotaPrincipal =  promisify(require('../../respostas/principal').RotaPrincipal);

app.use(session(CONFIG, app));
app.use(koaBody());
// or if you prefer all default config, just use => app.use(session(app));


app.use(async(ctx, next)=>{
   if(ctx.path === '/'){
       await new Promise((resolve, reject) => {
           RotaPrincipal(resultado =>{
              if(resultado.sucesso){
                  ctx.body = resultado.dados;
                  console.log('resultado');
                  resolve();
              } else {
                  ctx.body = resultado.erro;
                  reject();
              }
           });
       });
   } else {
       next();
   }
});

app.use(async(ctx, next)=>{
    if(ctx.path === '/post'){
        let n = ctx.session.views || 0;
        ctx.session.views = ++n;
        ctx.body = `resultado: ${ctx.request.body.qqcoisa} + ${ctx.session.views}`;
    } else {
        next();
    }
});


app.listen(3000);
console.log('listening on port 3000');