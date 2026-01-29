// importamos toda la configuracion como 'config' y exportamos 'config' para usar en otros modulos
import * as config from './config.js';
// añadirmos las funciones de puntuaciones.js que utilizaremos aqui
import { añadirPuntuacion, generarTablaPuntuaciones, calcularPuntuacion } from './puntuaciones.js';
// añadirmos las funciones de tablero.js que utilizaremos aqui
import { rellenarEspaciosTablero, pintarTableroLinstener, limpiarTablero, calcularDimension, crearArrayTablero, comprobarPosicionValida } from './tablero.js';
import { escribirPalabra, calcularPosicionAleatoria, calcularDireccionAleatoria, palabras, obtenerPalabrasApi } from './palabrasTablero.js';

import { temporizador } from './tiempo.js';

// # --- # Arrays para testing # --- #

const palabras2 = [
    // "roca",
    // "elefante",
    // "bosque",
    // "casa",
    // "perro",
    // "arbol",
    // "libro",
    // "sol",
    // "luna",
    // "coche",
    // "niño",
    // "escuela",
    // "ciudad",
    // "manzana",
    // "gato",
    // "montaña",
    // "playa",
    // "amigo",
    // "mesa",
    // "silla",
    // "zapato",
    "corazon",
    // "reloj",
    // "puerta",
    // "ventana",
    // "pajaro",
    // "flor"
];

// # --- # Lintener Boton iniciar # --- #

const btnEmpezar = document.getElementById('btnEmpezar');
const btnLimpiarTablero = document.getElementById('btnLimpiarTablero');

btnLimpiarTablero.style.display = "none";
btnLimpiarTablero.addEventListener('click', () => {limpiarTablero()});

btnEmpezar.addEventListener('click', () => {
    config.setATerminado(false);

    // 1. Hacer fade out del botón
    btnEmpezar.classList.add('fade-out');

    empezar();

    // 2. Al terminar la animación del botón
    btnEmpezar.addEventListener('animationend', function ocultarBtn() {
        config.setFechaInicioTemporizador(new Date());
        btnEmpezar.parentElement.style.display = 'none';
        btnEmpezar.style.display = 'none';
        btnEmpezar.removeEventListener('animationend', ocultarBtn);

        let elementos = ["sopaLetras", "palabras"];

        for (const element of elementos) {
            let elemento = document.getElementById(element);
            elemento.classList.add('fade-in');
            elemento.classList.add('despuesAnimacion');
            elemento.classList.remove("antesAnimacion");
        }
    });
});

// # --- # Comprobaciones iniciales # --- #

if (!navigator.cookieEnabled) {
    alert("Las cookies están deshabilitadas en su navegador");
}

const spanInternet = document.getElementById("checkInternet");
window.onoffline = () => {
    spanInternet.textContent = "No hay conexion a internet";
}
window.ononline = () => {
    spanInternet.textContent = "";
}

// # --- # Crear tablero # --- #

export async function empezar() {
    config.setDificultad(config.FACIL);

    const mapDificultad = {
        [config.FACIL]: 4,
        [config.MEDIO]: 8,
        [config.DIFICIL]: 12
    };

    const nPalabras = mapDificultad[config.dificultad] || 4; // fallback por si acaso
    console.log(nPalabras+" fsdfs");
    console.log(config.dificultad);

    const aPalabras = await obtenerPalabrasApi(nPalabras);
    config.setListaPalabras(new Set(aPalabras));

    añadirPuntuacion("yokese", 29, 73, 4);
    añadirPuntuacion("jesus", 73, 25, 5);
    generarTablaPuntuaciones();

    config.setDimension(calcularDimension(config.listaPalabras));

    let tablero = crearArrayTablero(config.dimension);

    console.info("dimension: ",config.dimension);

    for (const palabra of config.listaPalabras) {
        let nIntentos = 0,
            posicion = null,
            direccion = 0,
            esValida = false
        ;
        do {
            posicion = calcularPosicionAleatoria(config.dimension);
            direccion = calcularDireccionAleatoria();
            esValida = comprobarPosicionValida(tablero,palabra,posicion,direccion);

            nIntentos++;
        } while (!esValida && nIntentos < 50);

        if (esValida) {
            config.aPalabrasTablero.push(palabra)
            escribirPalabra(tablero,palabra,posicion,direccion);
        } else {
            console.error(palabra, "no ha encontrado sitio valido");
        }
    }

    // pintarTablero(tablero);
    rellenarEspaciosTablero(tablero);
    pintarTableroLinstener(tablero);

    console.log(tablero);
    palabras();
}

// # --- # FUNCIONES # --- #

/**
 * Termina la partida, pide el nombre del jugador y guarda su puntuación.
 */
export function terminar() {
    const tiempo = temporizador();
    config.setATerminado(true);
    const nPal = config.aPalabrasEncontradas.size;
    const puntuacion = calcularPuntuacion();

    const fondo = document.getElementById("fondoPrompt");
    const prompt = document.getElementById("cuerpoPrompt");
    const mensaje = document.getElementById("msgPrompt");
    const input = document.getElementById("datoPrompt");

    mensaje.innerText = "¡Has ganado! Introduce tu nombre para añadir tu puntuación";
    input.placeholder = "Tu nombre";

    fondo.classList.add("despuesAnimacion");

    function enviar(ev) {
        ev.preventDefault();

        if (!input.value.trim()) {
            input.classList.add("error");
            setTimeout(() => input.classList.remove("error"), 400);
        } else {
            const nombre = input.value;

            añadirPuntuacion(nombre, puntuacion, tiempo, nPal);
            generarTablaPuntuaciones();

            prompt.removeEventListener("submit", enviar);
            fondo.classList.remove("despuesAnimacion");
        }
        input.value = "";
    }

    prompt.addEventListener("submit", enviar);
    btnLimpiarTablero.style.display = "";
    btnEmpezar.parentElement.style.display = "";
}