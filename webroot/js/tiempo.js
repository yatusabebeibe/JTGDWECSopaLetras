import * as config from './config.js';

/**
 * Funcion para obtener la hora local formateada
 * @returns string
 */
export function obtenerHoraActual() {
    const instante = new Date();

    return instante.toLocaleTimeString();
}

/**
 * Devuelve el num de seg desde que se empezo la sopa de letras
 * @returns {int} segundos desde que se empezo la sopa de letras
 */
export function temporizador() {
    let segundos = parseInt( ( (new Date()) - config.fechaInicioTemporizador ) / 1000 );
    segundos = config.fechaInicioTemporizador ? segundos : 0;

    return segundos;
}

/**
 * Convierte segundos a formato legible automáticamente.
 * Si son menos de 3600 segundos devuelve "min:seg",
 * si son 3600 o más devuelve "hor:min:seg".
 * @param {number} seg - Número de segundos
 * @returns {string} Tiempo formateado
 */
export function segATiempo(seg) {
    if (seg < 3600) {
        const min = Math.floor(seg / 60);
        const s = seg % 60;
        return `${min}:${s.toString().padStart(2, "0")}`;
    }

    const hor = Math.floor(seg / 3600);
    const min = Math.floor((seg % 3600) / 60);
    const s = seg % 60;
    return `${hor}:${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}