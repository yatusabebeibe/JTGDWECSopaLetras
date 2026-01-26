import * as config from './config.js';
import { obtenerHoraActual, temporizador, segATiempo } from './tiempo.js';

document.addEventListener("DOMContentLoaded",() =>{
    actualizarHoraActual();
    actualizarTemporizador();
})

function actualizarTemporizador() {
    setInterval(() => {
        if (!config.aTerminado)
        document.getElementById("temporizador").innerHTML = segATiempo(temporizador());
    }, 333);
}

function actualizarHoraActual() {
    let textoHora = document.getElementById("hora");
    textoHora.innerHTML = obtenerHoraActual();

    setInterval(() => {
        textoHora.innerHTML = obtenerHoraActual();
    }, 1000);
}