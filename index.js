const express_jwt = require('./servidores/express/jwt');
const koa_jwt = require('./servidores/koa/jwt');
const hapi_jwt = require('./servidores/hapi/jwt');

const express_session = require('./servidores/express/session');
const hapi_session = require('./servidores/hapi/session');
const koa_session = require('./servidores/koa/session');

hapi_session();