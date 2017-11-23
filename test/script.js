import { check, sleep } from "k6";
import http from "k6/http";

let id = 0;

export let options = {
    vus: 2,
    duration: "5s"
};

let aux = 0;

export default function() {
    console.log(aux);
    aux ++;
    sleep(1);
};