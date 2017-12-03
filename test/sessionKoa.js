import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
    vus: 5,
    duration: "30s"
};

const dominio = '192.168.0.15';

const url = {
    home: `http://${dominio}:3000`,
    login: `http://${dominio}:3000/login`,
    filme: `http://${dominio}:3000/filme/`,
    perfil: `http://${dominio}:3000/perfil`,
};

const id_filmes = [
    '569190ca24de1e0ce2dfcd4f',
    '569190d024de1e0ce2dfcd80',
    '569190d024de1e0ce2dfcd7d',
    '569190d124de1e0ce2dfcd89',
    '569190d224de1e0ce2dfcd94',
    '5692a13c24de1e0ce2dfceb2',
    '5692a13d24de1e0ce2dfcec2',
    '5692a13b24de1e0ce2dfcead',
    '569190d124de1e0ce2dfcd82',
    '569190d124de1e0ce2dfcd83'
];

const usuarios = [
    {
        "usuario":"kata",
        "senha":"123"
    },
    {
        "usuario":"mathias",
        "senha":"123"
    },
    {
        "usuario":"amelio",
        "senha":"blablabla2017"
    },
    {
        "usuario":"leonite",
        "senha":"201820182018"
    },
    {
        "usuario":"denize",
        "senha":"753159dbaaaaa"
    }
];

const rotas = [
    acessarPerfilUsuario,
    acessarHome,
    acessarInfoFilmesAleatorio
];

let aux_cont = 0;
let koa = '';
let koasig = '';

function fazerLogin(usuario, senha) {

    /**
     * Essa função tem como objetivo receber um usuário e uma senha
     * e passar
     */

    const params =  {
        headers: { "Content-Type": "application/json" },
    };

    const conteudo = JSON.stringify({
        "usuario": usuario,
        "senha": senha
    });

    return http.post(url.login, conteudo, params);

}

function registraCookieId(stringCookie) {

    /**
     * A resposta do http para cookies vem no formado string,
     * por conta disso eu preciso pegar o dado na mão.
     */

    koa = stringCookie.cookies['koa'][0].value;
    koasig = stringCookie.cookies['koa.sig'][0].value;
    return {koa, koasig};
}

function acessarInfoFilmesAleatorio() {

    /**
     * Para acessar as infos de filmes é necessário estar autenticado.
     * Por conta disso, é configurado o params da requisicao.
     * O ID é escolhido aleatoriamente para facilitar os testes e não possibitar cache facilitado do mongodb
     */

    const params =  {
        headers: {  "Content-Type": "application/json" },
        cookies: {  "koa": { value: koa, replace: true },
            "koa.sig": { value: koasig, replace: true }
        }
    };

    const id_aleatorio = Math.floor(Math.random() * (id_filmes.length));

    return http.get(url.filme + id_filmes[id_aleatorio], params);
}

function acessarRotasAleatorio() {
    rotas[Math.floor(Math.random() * rotas.length)]();
}

function acessarPerfilUsuario() {

    /**
     * Para acessar as infos de filmes é necessário estar autenticado.
     * Por conta disso, é configurado o params da requisicao.
     * O ID é escolhido aleatoriamente para facilitar os testes e não possibitar cache facilitado do mongodb
     */

    const params =  {
        headers: {  "Content-Type": "application/json" },
        cookies: {  "koa": { value: koa, replace: true },
            "koa.sig": { value: koasig, replace: true }
        }
    };

    return http.get(url.perfil, params);
}

function acessarHome() {
    /**
     * Rota principal.js da aplicação que não depende de autenticacao
     */
    return http.get(url.home);
}

function loginAleatorio(){
    const numeroAleatorio = Math.floor((Math.random() * usuarios.length));
    return fazerLogin(usuarios[numeroAleatorio].usuario,usuarios[numeroAleatorio].senha);
}

export default function() {
    if(aux_cont === 0){
        const respostaAutenticacao = loginAleatorio();
        registraCookieId(respostaAutenticacao);
        aux_cont ++
    } else {
        acessarRotasAleatorio();
    }
    // sleep(1);
};