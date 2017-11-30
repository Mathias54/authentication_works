/**
 * Created by mathias on 24/09/17.
 */
/**
 * Created by mathias on 12/09/17.
 */

const jwt = require('jsonwebtoken');
const http = require('http');
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const jwt_key = require('../../bancoDeDados/servidorConfigs').jwt.key;
const app = new Koa();
const koaBody = require('koa-body');
const {RotaPrincipal, RotaDetalheFilme, RotaPerfilUsuario} = require('../../respostas/principal');
const {isValidUser} = require('../../bancoDeDados/User');
const {http_porta, https_porta} = require('../../bancoDeDados/servidorConfigs');
const executarHttps = process.argv[4] === 'https';

module.exports = function () {
    app.use(koaBody());

    /**
     * Rota de Autenticação (Não protegida)
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

                        jwt.sign({id: user._id, usuario: user.usuario}, jwt_key, (erro, token) => {
                            if (!erro) {
                                ctx.body = {
                                    sucesso: true,
                                    token: token
                                    /**
                                     * TODO gerar token apenas se não foi gerado anteriormente
                                     */
                                };
                                marcador.mark('FIM_LOGIN');
                                compararMarks('LOGIN_KOA_JWT', 'INI_LOGIN', 'FIM_LOGIN');
                                resolve();
                            } else {
                                ctx.body = {
                                    sucesso: false,
                                    erro: `Erro ocorrido na geração do JWT: ${erro}`
                                };
                                resolve();
                            }
                        });
                    } else {
                        ctx.body = {
                            sucesso: false,
                            erro: `Erro ocorrido na busca: ${erro}`
                        };
                        resolve()
                    }
                });
            });
        } else {
            await next();
        }
    });

// TODO fazer rota de cadastro

    /**
     * Rota principal.js home; (Não protegida)
     */
    app.use(async (ctx, next) => {
        if (ctx.path === '/') {
            marcador.mark('INI_HOME');
            await new Promise((resolve, reject) => {
                RotaPrincipal(resultado => {
                    if (resultado.sucesso) {
                        ctx.body = resultado.dados;
                        marcador.mark('FIM_HOME');
                        compararMarks('HOME_KOA_JWT', 'INI_HOME', 'FIM_HOME');
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
     * Middleware de proteção.
     */
    app.use(async (ctx, next) => {
        marcador.mark('INI_MIDDLEWARE');
        const token = ctx.request.body.token|| ctx.request.headers['authorization'];
        // || ctx.request.param.token
        // || ctx.request.headers['x-access-token']
        // || ctx.request.headers['X-Access-Token']
        // || ctx.request.headers['authorization']
        // || ctx.request.headers['token'];


        if (token) {
            await new Promise((resolve, reject) => {
                jwt.verify(token, jwt_key, (err, decoded) => {
                    /**
                     * TODO como evitar análise desnecessária.
                     */
                    if (err) {
                        reject(err);
                    } else {
                        marcador.mark('FIM_MIDDLEWARE');
                        compararMarks('MIDDLEWARE_KOA_JWT', 'INI_MIDDLEWARE', 'FIM_MIDDLEWARE');
                        resolve(decoded);
                    }
                });
            }).then(
                async (decoded) => {
                    ctx.request.session = decoded;
                    await next();
                }
            ).catch(err => {
                ctx.body = {
                    sucesso: false,
                    mensagem: `Seu Token Espirou: ${err}`,
                };
            });
        } else {
            ctx.body = {
                sucesso: false,
                mensagem: 'Você não forneceu um token',
            };
        }
    });

    /**
     * Rota acessar dados perfil
     */
    app.use(async (ctx, next) => {
        if (ctx.path === '/perfil') {
            marcador.mark('INI_PERFIL');
            await new Promise((resolve, reject) => {
                const id = ctx.request.session.id;
                RotaPerfilUsuario(id, retorno => {
                    if (retorno.sucesso) {
                        ctx.body = retorno.dado;
                        marcador.mark('FIM_PERFIL');
                        compararMarks('PERFIL_KOA_JWT', 'INI_PERFIL', 'FIM_PERFIL');
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
            if (rota[2]) {
                marcador.mark('INI_FILMEID');
                await new Promise((resolve, reject) => {
                    RotaDetalheFilme(rota[2], retorno => {
                        if (retorno.erro) {
                            ctx.body = retorno.erro;
                            reject();
                        } else {
                            ctx.body = retorno.dado;
                            marcador.mark('FIM_FILMEID');
                            compararMarks('FILMEID_KOA_JWT', 'INI_FILMEIF', 'FIM_FILMEID');
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
        console.log(`Servidor Koa JWT rodando HTTP na porta ${http_porta}`)
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
            console.log(`Servidor Koa JWT rodando HTTP na porta ${https_porta}`)
        });
    }

};