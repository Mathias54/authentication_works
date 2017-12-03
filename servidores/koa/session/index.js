/**
 * Created by mathias on 12/09/17.
 */

const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const https = require('https');
const http = require('http');
const koaBody = require('koa-body');
const {RotaPrincipal, RotaDetalheFilme, RotaPerfilUsuario} = require('../../respostas/principal');
const {isValidUser} = require('../../bancoDeDados/User');
const {https_porta, http_porta} = require('../../bancoDeDados/servidorConfigs');
const executarHttps = process.argv[4] === 'https';
const {marcador, compararMarks} = require('../../medicao/index');

module.exports = function () {

    app.keys = ['some secret hurr'];

    const CONFIG = {
        key: 'koa', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
    };

    app.use(session(CONFIG, app));
    app.use(koaBody());

    /**
     * Rota de Autenticação
     */
    app.use(async (ctx, next) => {
        if (ctx.path === '/login') {
            marcador.mark('INI_LOGIN');
            const query = {
                usuario: ctx.request.body.login || ctx.request.body.email || ctx.request.body.nome || ctx.request.body.user || ctx.request.body.name || ctx.request.body.usuario,
                senha: ctx.request.body.password || ctx.request.body.senha
            };
            await new Promise((resolve, reject) => {
                isValidUser(query, (erro, user) => {
                    if (!erro && user) {
                        query.id = user._id;
                        ctx.session.logado = query;
                        ctx.body = {
                            sucesso: true,
                            mensagem: 'Usuario logado'
                        };
                        marcador.mark('FIM_LOGIN');
                        compararMarks('LOGIN_KOA_SESSION', 'INI_LOGIN', 'FIM_LOGIN');
                        resolve();
                    } else {
                        ctx.body = {
                            sucesso: false,
                            erro: `Erro ocorrido na busca: ${erro}`
                        };
                        reject();
                    }
                });
            });
        } else {
            await next();
        }
    });

    /**
     * Rota principal.js home;
     */
    app.use(async (ctx, next) => {
        if (ctx.path === '/') {
            marcador.mark('INI_HOME');
            await new Promise((resolve, reject) => {
                RotaPrincipal(resultado => {
                    if (resultado.sucesso) {
                        ctx.body = resultado.dados
                        marcador.mark('FIM_HOME');
                        compararMarks('HOME_KOA_SESSION', 'INI_HOME', 'FIM_HOME');
                        resolve();
                    } else {
                        ctx.body = resultado.erro;
                        reject();
                    }
                });
            });
        } else {
            await next();
        }
    });

    /**
     * Rota acessar dados perfil
     */
    app.use(async (ctx, next) => {
        if (ctx.path === '/perfil') {
            marcador.mark('INI_PERFIL');
            if (!ctx.session.logado) {
                return ctx.body = 'Usuário não autenticado';
            }
            await new Promise((resolve, reject) => {
                RotaPerfilUsuario(ctx.session.logado.id, retorno => {
                    if (retorno.sucesso) {
                        ctx.body = retorno.dado;
                        marcador.mark('FIM_PERFIL');
                        compararMarks('PERFIL_KOA_SESSION', 'INI_PERFIL', 'FIM_PERFIL');
                        resolve();
                    } else {
                        ctx.body = `Erro ao listar detalhes do filme: ${retorno.erro}`;
                        reject();
                    }
                });
            });
        } else {
            await next();
        }
    });

    /**
     * Rota detalhes do filme
     */
    app.use(async (ctx, next) => {
        const rota = ctx.path.split('/');
        if (rota[1] === 'filme') {
            marcador.mark('INI_FILMEID');
            if (!ctx.session.logado) {
                return ctx.body = 'Usuário não autenticado';
            }
            if (rota[2]) {
                await new Promise((resolve, reject) => {
                    RotaDetalheFilme(rota[2], retorno => {
                        if (retorno.erro) {
                            ctx.body = retorno.erro;
                            reject();
                        } else {
                            ctx.body = retorno.dado;
                            marcador.mark('FIM_FILMEID');
                            compararMarks('FILMEID_KOA_SESSION', 'INI_FILMEID', 'FIM_FILMEID');
                            resolve();
                        }
                    });
                });
            } else {
                ctx.body = 'Forneça um Id válido para acessar os detalhes';
            }
        } else {
            await next();
        }
    });


    http.createServer(app.callback()).listen(http_porta, () => {
        console.log(`Servidor Koa Session rodando HTTP na porta ${http_porta}`)
    });

    if (executarHttps) {
        let options = {
            key: fs.readFileSync(__dirname + '/../../chaves/liberep.key'),
            cert: fs.readFileSync(__dirname + '/../../chaves/8b521c56e11f0512.crt'),
            ca: [
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle01.crt'),
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle02.crt'),
                fs.readFileSync(__dirname + '/../../chaves/gd_bundle03.crt')
            ]
        };

        https.createServer(options, app.callback()).listen(https_porta, () => {
            console.log(`Servidor Koa Session rodando HTTP na porta ${https_porta}`)
        });
    }
};
