import * as config from './config.js';
import { terminar } from './main.js';

/**
 *
 * @param {Array} tablero
 * @param {string} palabra
 * @param {{posFila: number, posCol: number}} posicion
 * @param {{direcFila:number, direcCol:number}} direccion
 */
export function escribirPalabra(tablero, palabra, posicion, direccion) {
    const {posFila, posCol} = posicion;
    const {direcFila, direcCol} = direccion;

    for (let i = 0; i < palabra.length; i++){
        let fila = posFila + i * direcFila;
        let celda = posCol + i * direcCol;

        tablero[fila][celda] = palabra[i];
    }
}

/**
 *
 * @param {number} dimension
 * @returns {{posFila: number, posCol: number}} posicion
 */
export function calcularPosicionAleatoria(dimension) {
    return  {
        posFila: parseInt(Math.random()*dimension),
        posCol: parseInt(Math.random()*dimension)
    }
}

/**
 * @returns {{direcFila:number, direcCol:number}} Numero equivalente a una direccion.
 */
export function calcularDireccionAleatoria() {
    const movimientos = [
        // [-1, 0],  // 0 ↑
        // [-1, 1],  // 1 ↗
        [0, 1],   // 2 →
        [1, 1],   // 3 ↘
        [1, 0],   // 4 ↓
        // [1, -1],  // 5 ↙
        // [0, -1],  // 6 ←
        // [-1, -1]  // 7 ↖
    ];
    const direccion = parseInt(Math.random()*movimientos.length);
    return {
        direcFila: movimientos[direccion][0],
        direcCol: movimientos[direccion][1]
    };
}

/**
 * Obtiene la palabra en el orden de la seleccion
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones
 * @returns {string} `string` La palabra seleccionada
 */
export function obtenerPalabra( { primera, ultima } ) {
    let palabra = "";

    /** @type {HTMLTableElement} */
    let tabla = document.getElementById("tablaListener");

    let difX = Math.abs(primera.X - ultima.X);
    let difY = Math.abs(primera.Y - ultima.Y);

    const dirX = primera.X < ultima.X ? 1 : -1 ; // Direccion horizontal -
    const dirY = primera.Y < ultima.Y ? 1 : -1 ; // Direccion vertical |

    if (difX > difY)
    { // Horizontal -
        for (let pos = primera.X; pos != ( ultima.X + dirX ); pos += dirX) {
            palabra += tabla.children[primera.Y].children[pos].textContent;
        }
    }
    else if (difY > difX)
    { // Vertical |
        for (let pos = primera.Y ; pos!=( ultima.Y + dirY ) ; pos+= dirY) {
            palabra += tabla.children[pos].children[primera.X].textContent;
        }
    }
    else
    { // Diagonal X
        let X = primera.X;
        let Y = primera.Y;

        while ( ( X !== ultima.X + dirX ) && ( Y !== ultima.Y + dirY ) ) {
            palabra += tabla.children[Y].children[X].textContent;
            X += dirX;  Y += dirY;
        }
    }
    return palabra;
}

/**
 * Pinta la seleccion
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones
 */
export function pintarPalabra( { primera, ultima } ) {
    let palabra = "";
    const x = () => {return Math.floor(Math.random() * 128)+112}
    const color = `rgb(${x()}, ${x()}, ${x()})`;

    /** @type {HTMLTableElement} */
    let tabla = document.getElementById("tablaListener");

    let difX = Math.abs(primera.X - ultima.X);
    let difY = Math.abs(primera.Y - ultima.Y);

    const dirX = primera.X < ultima.X ? 1 : -1 ; // Direccion horizontal -
    const dirY = primera.Y < ultima.Y ? 1 : -1 ; // Direccion vertical |

    if (difX > difY)
    { // Horizontal -
        for (let pos = primera.X; pos != ( ultima.X + dirX ); pos += dirX) {
            tabla.children[primera.Y].children[pos].style.background = color;
            console.log(tabla.children[primera.Y].children[pos].style.color);
        }
    }
    else if (difY > difX)
    { // Vertical |
        for (let pos = primera.Y ; pos!=( ultima.Y + dirY ) ; pos+= dirY) {
            tabla.children[pos].children[primera.X].style.background = color;
            console.log(tabla.children[pos].children[primera.X].style.color);
        }
    }
    else
    { // Diagonal X
        let X = primera.X;
        let Y = primera.Y;

        while ( ( X !== ultima.X + dirX ) && ( Y !== ultima.Y + dirY ) ) {
            tabla.children[Y].children[X].style.background = color;
            console.log(tabla.children[Y].children[X].style.color);
            X += dirX;  Y += dirY;
        }
    }
}

/**
 * Procesa una palabra correcta encontrada en la sopa de letras.
 *
 * @param {string} palabra La palabra que se ha encontrado.
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones Posiciones de la primera y última letra de la palabra en el tablero.
 */
export function procesarCorrecta(palabra, posiciones) {
    config.aPalabrasEncontradas.add(palabra);
    pintarPalabra(posiciones);
    palabras();

    if (config.aPalabrasEncontradas.size == config.aPalabrasTablero.length) {
        // Aqui iria lo que pasa al terminar
        terminar();
    }
}

/**
 * Comprueba si la palabra seleccionada era una de las que habia que encontrar
 * @param {string} palabra La palabra a comprobar
 * @returns {boolean} Si esxiste o no
 */
export function comprobarPalabraOrdenada( palabra ) {
    return config.listaPalabras.has(palabra);
}

/**
 * Comprueba si la palabra seleccionada se ha seleccionado al reves y era una de las que habia que encontrar
 * @param {string} palabra
 * @returns {string|false} La palabra invertida o falso si no es una palabra a buscar
 */
export function comprobarPalabraInvertida( palabra ) {
    let invertida = palabra.split("").reverse().join("");
    return config.listaPalabras.has(invertida) ? invertida : false;
}

/**
 * Muestra en el DOM la lista de palabras de la sopa de letras,
 * marcando las que ya han sido encontradas.
 */
export function palabras() {
    let elementoListaPalabras = document.getElementById("palabras");
    let gridPalabras = document.createElement("div");

    elementoListaPalabras.innerHTML = "";

    for (const palabra of config.aPalabrasTablero) {
        let pPalabra = document.createElement("p");

        pPalabra.innerText = palabra;

        if (config.aPalabrasEncontradas.has(palabra))  pPalabra.classList.add("encontrada");

        gridPalabras.appendChild(pPalabra);
    }
    elementoListaPalabras.appendChild(gridPalabras);
}