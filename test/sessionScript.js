import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
    vus: 10,
    duration: "5s"
};

const dominio = '192.168.0.15';

const url = {
    home: `http://${dominio}:3000/`,
    login: `http://${dominio}:3000/login/`,
    filme: `http://${dominio}:3000/filme/`,
    perfil: `http://${dominio}:3000/perfil/`,
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

const rotas = [
    acessarPerfilUsuario,
    acessarHome,
    acessarInfoFilmesAleatorio
];

let aux_cont = 0;

let valorconnectsid = '';

function fazerLogin(usuario, senha) {

    /**
     * Essa função tem como objetivo receber um usuário e uma senha
     * e passar a resposta
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

    valorconnectsid = stringCookie.cookies['connect.sid'][0].value;
    return valorconnectsid;
}

function acessarInfoFilmesAleatorio() {

    /**
     * Para acessar as infos de filmes é necessário estar autenticado.
     * Por conta disso, é configurado o params da requisicao.
     * O ID é escolhido aleatoriamente para facilitar os testes e não possibitar cache facilitado do mongodb
     */

    const params =  {
        headers: { "Content-Type": "application/json" },
        cookies: { "connect.sid": { value: valorconnectsid, replace: true }}
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
        headers: { "Content-Type": "application/json" },
        cookies: { "connect.sid": { value: valorconnectsid, replace: true }}
    };

    return http.get(url.perfil, params);
}

function acessarHome() {
    /**
     * Rota principal da aplicação que não depende de autenticacao
     */
    return http.get(url.home);
}

export default function() {

    if(aux_cont === 0){
        const respostaAutenticacao = fazerLogin('mathias', '123');
        registraCookieId(respostaAutenticacao);
        aux_cont ++;
    } else {
        acessarRotasAleatorio();
    }
};