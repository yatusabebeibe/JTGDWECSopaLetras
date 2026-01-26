/** @type boolean - si ha terminado o no */
export var aTerminado = true;

/** @type Date - fecha y hora en la que inniciamos la sopa de letra */
export var fechaInicioTemporizador = null;

/** @type number - alto y ancho de la sopa de letra */
export var dimension = 0;

/** @type Set<string> - lista con las palabras que vamos a usar para generar la sopa de letras */
export var listaPalabras = null;

/** @type string - dificultad del juego actual */
export var dificultad = null;
export const FACIL = "facil";
export const MEDIO = "medio";
export const DIFICIL = "dificil";

// # --- # Inicio Arrays # --- #
export const aPalabrasTablero = [];
export const aPalabrasEncontradas = new Set();


// Setters
export function setATerminado(valor) { aTerminado = valor; }
export function setFechaInicioTemporizador(valor) { fechaInicioTemporizador = valor; }
export function setDimension(valor) { dimension = valor; }
export function setListaPalabras(valor) { listaPalabras = valor; }
export function setDificultad(valor) { dificultad = valor; }