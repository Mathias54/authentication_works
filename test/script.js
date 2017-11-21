import { check, sleep } from "k6";
import http from "k6/http";

let aux = 0;
let id = 0;

export default function() {

    if(aux === 0){
        let res = http.get("http://192.168.0.15:8000/");

        console.log(res.body);

        id = res.cookies.id[0].value;

        aux ++;
    }

    console.log(id);

    const params =  {
        headers: { "Content-Type": "application/json" },
        cookies: { "id": { value: id, replace: true }}
    };

    const retorno = http.get("http://192.168.0.15:8000/", params);
    console.log(retorno.body);

    sleep(3);
};