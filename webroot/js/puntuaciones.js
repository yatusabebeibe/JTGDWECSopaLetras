import * as config from './config.js';
import { segATiempo, temporizador } from "./tiempo.js";

/**
 * Obtiene todas las puntuaciones almacenadas en localStorage.
 * @returns {Array<{nombre: string, puntuacion: number}>} Array de objetos con nombre y puntuación.
 */
export function obtenerPuntuaciones() {
    return JSON.parse(sessionStorage.getItem("puntuaciones")) || {
        facil: { primera: {}, segunda: {}, tercera: {} },
        medio: { primera: {}, segunda: {}, tercera: {} },
        dificil: { primera: {}, segunda: {}, tercera: {} }
    };
}

/**
 * Añade una nueva puntuación si no existe o es mejor y mantiene el array ordenado de mayor a menor.
 * @param {string} nombre - Nombre del usuario.
 * @param {number} puntuacion - Puntuación obtenida por el jugador.
 * @param {number} tiempo - Segundos que ha durado la partida.
 * @param {number} nPalabras - Cuantas palabras se crearon.
 */
export function añadirPuntuacion(nombre, puntuacion, tiempo, nPalabras) {
    let puntuaciones = obtenerPuntuaciones();

    let lista = [];
    for (let clave of ["primera", "segunda", "tercera"]) {
        if (puntuaciones[config.dificultad][clave].nombre) {
            lista.push(puntuaciones[config.dificultad][clave]);
        }
    }

    let usuario = lista.find(u => u.nombre === nombre);

    if (usuario) {
        if (puntuacion > usuario.puntuacion) {
            usuario.puntuacion = puntuacion;
            usuario.tiempo = tiempo;
            usuario.nPalabras = nPalabras;
        }
    } else {
        lista.push({ nombre, puntuacion, tiempo, nPalabras });
    }

    lista.sort((a, b) => b.puntuacion - a.puntuacion);
    lista = lista.slice(0, 3);

    puntuaciones[config.dificultad].primera = lista[0] || {};
    puntuaciones[config.dificultad].segunda = lista[1] || {};
    puntuaciones[config.dificultad].tercera = lista[2] || {};

    sessionStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
}

/**
 * Rellena la tabla de puntuaciones en el HTML con los datos almacenados en localStorage.
 * La tabla debe tener un tbody dentro de #puntuaciones.
 */
export function generarTablaPuntuaciones() {
    let puntuaciones = obtenerPuntuaciones();
    let tbody = document.querySelector("#puntuaciones tbody");
    tbody.innerHTML = "";

    let posiciones = ["primera", "segunda", "tercera"];
    let indice = 1;

    for (let clave of posiciones) {
        let puntuacion = puntuaciones[config.dificultad][clave];

        // si la posición está vacía, saltar
        if (!puntuacion.nombre) continue;

        let fila = document.createElement("tr");

        let celdaN = document.createElement("td");
        let celdaNom = document.createElement("td");
        let celdaPun = document.createElement("td");
        let celdaSeg = document.createElement("td");
        let celdanPal = document.createElement("td");

        celdaN.textContent = indice;
        fila.appendChild(celdaN);

        celdaNom.textContent = puntuacion.nombre;
        fila.appendChild(celdaNom);

        celdaPun.textContent = puntuacion.puntuacion;
        fila.appendChild(celdaPun);

        celdaSeg.textContent = segATiempo(puntuacion.tiempo);
        fila.appendChild(celdaSeg);

        celdanPal.textContent = puntuacion.nPalabras;
        fila.appendChild(celdanPal);

        tbody.appendChild(fila);

        indice++;
    }
}

/**
 * Calcula el tiempo aprox en segundos segun el número de palabras.
 * El tiempo por palabra aumenta según la cantidad total de palabras
 * y se aplica por igual a todas ellas.
 *
 * @param {number} numPalabras Número total de palabras en la sopa.
 * @returns {number} Tiempo máximo total en segundos.
 */
export function calcularTiempoMaximo(numPalabras) {
    if (numPalabras <= 0) return 0;

    const TIEMPO_BASE = 12;
    const nPALABRAS_TRAMO1 = 5;
    const TIEMPO_TRAMO2 = 32;
    const nPALABRAS_TRAMO2 = 24;
    const FACTOR_AUMENTO = 1.25;

    let tiempoPorPalabra;

    if (numPalabras <= nPALABRAS_TRAMO1) {
        tiempoPorPalabra = TIEMPO_BASE;
    }
    else if (numPalabras <= nPALABRAS_TRAMO2) {
        const progreso = numPalabras / nPALABRAS_TRAMO2;
        tiempoPorPalabra = TIEMPO_BASE + (TIEMPO_TRAMO2 - TIEMPO_BASE) * progreso;
    }
    else {
        tiempoPorPalabra = TIEMPO_TRAMO2 * FACTOR_AUMENTO;
    }

    return Math.round(numPalabras * tiempoPorPalabra);
}

/**
 * Calcula la puntuación total de la sopa de letras según el tiempo y las palabras encontradas.
 *
 * @returns {number} La puntuación total redondeada.
 */
export function calcularPuntuacion() {
    const encontradas = [...config.aPalabrasEncontradas].filter(palabra => config.aPalabrasTablero.includes(palabra)).length;

    let puntuacion = encontradas * 10;

    const nENCONTRADAS = config.aPalabrasEncontradas.size;
    const nEN_SOPA = config.aPalabrasTablero.length;

    puntuacion *= ( (calcularTiempoMaximo(nENCONTRADAS) - temporizador()) / calcularTiempoMaximo(nEN_SOPA) ) + 1;

    if ( nENCONTRADAS < nEN_SOPA ) {
        let factor = nENCONTRADAS / nEN_SOPA;
        puntuacion *= Math.max(factor, 0.7);
    }

    return Math.round(puntuacion);
}