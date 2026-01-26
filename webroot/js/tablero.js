// importamos las cosas que vamos a usar
import * as config from './config.js';
import { comprobarPalabraInvertida, comprobarPalabraOrdenada, obtenerPalabra, procesarCorrecta } from './palabrasTablero.js';


/**
 *
 * @param {number} dimension
 * @returns {Array} Array del tablero
 */
export function crearArrayTablero(dimension) {
    const array = new Array(dimension);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(dimension);
    }
    return array;
}

/**
 * <Expicacion>
 * @param {Array} aPalabras - Array de palabras para calcular el alto/ancho minimo.
 * @returns {number} dimension -
*/
export function calcularDimension(aPalabras) {
    let masLarga=0, total=0;
    for (const palabra of aPalabras) {
        if (masLarga<palabra.length) {
            masLarga = palabra.length;
        }
        total += palabra.length;
    }
    let minLinea = Math.ceil(Math.sqrt(2 * total));

    return Math.max(masLarga, minLinea);
}

/**
 *
 * @param {Array} tablero
 * @returns Array rellenado con letras
 */
export function rellenarEspaciosTablero(tablero) {
    const vocales = ["A", "E", "I", "O", "U"];
    const consonantes = [
        "B","C","D","F","G","H","J","K","L","M",
        "N","Ñ","P","Q","R","S","T","V","W","X","Y","Z"
    ];

    for (let i = 0; i < tablero.length; i++)
    {
        for (let j = 0; j < tablero[i].length; j++)
        {
            if (tablero[i][j] === null || tablero[i][j] === undefined) {
                let nAleatorio = Math.random();
                if (nAleatorio < 0.7) {
                    tablero[i][j] = consonantes[parseInt(Math.random() * consonantes.length)].toLowerCase();
                } else {
                    tablero[i][j] = vocales[parseInt(Math.random() * vocales.length)].toLowerCase();
                }
            }
        }
    }
}

/**
 *
 * @param {Array} tablero
 * @param {string} palabra
 * @param {{posFila: number, posCol: number}} posicion
 * @param {{direcFila:number, direcCol:number}} direccion
 * @returns {boolean}
 */
export function comprobarPosicionValida(tablero, palabra, posicion, direccion) {
    const nFilas = tablero.length;
    const nCol = tablero[0].length;
    const {posFila, posCol} = posicion;
    const {direcFila, direcCol} = direccion;

    const ultimaFila = posFila + direcFila * (palabra.length - 1);
    const ultimaCol = posCol + direcCol * (palabra.length - 1);

    if (ultimaFila < 0 || ultimaFila >= nFilas || ultimaCol < 0 || ultimaCol >= nCol) {
        return false;
    }

    // recorremos la palabra letra con letra para comprobar
    for (let i = 0; i < palabra.length; i++) {
        // Calculamos la posicion de las letras en el tablero
        let fila = posFila + i * direcFila;
        let col = posCol + i * direcCol;
        const celda = tablero[fila][col];

        // Comprobacion si las palabras se cruzan
        console.log(celda === palabra[i]? `${palabra} y otro utilizan misma letra en la posicon ${fila} ${col}`:"-");

        // si no esta en un espacio vacio o la letra no coincide, mal
        if (celda != null && celda !== palabra[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Pinta el tablero en el DOM
 * @param {string[]} tablero
 */
export function pintarTablero(tablero) {
    const sopaLetras = document.getElementById("sopaLetras");

    const tabla = document.createElement("table");

    for (let i = 0; i < tablero.length; i++)
    {
        let fila = document.createElement("tr");

        for (let j = 0; j < tablero[i].length; j++)
        {
            let celda = document.createElement("td");
            celda.textContent = tablero[i][j]
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    sopaLetras.appendChild(tabla);
}

/**
 * Pinta el tablero en el DOM añadiendo event Listener a cada celda
 * @param {string[]} tablero
 */
export function pintarTableroLinstener(tablero) {
    const sopaLetras = document.getElementById("sopaLetras");

    while (sopaLetras.children[1]) sopaLetras.remove(sopaLetras.children[1]);

    const tabla = document.createElement("table");

    for (let i = 0; i < tablero.length; i++)
    {
        let fila = document.createElement("tr");

        for (let j = 0; j < tablero[i].length; j++)
        {
            let celda = document.createElement("td");
            celda.textContent = tablero[i][j];

            celda.addEventListener("click", (ev) => {
                ev.preventDefault();

                let seleccionado = document.getElementById("seleccionado");
                console.log(seleccionado); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

                if (seleccionado == null) {
                    // console.log("noexiste"); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
                    celda.id = "seleccionado";
                } else {
                    // console.log("existe"); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
                    celda.id = ""; seleccionado.id = "";

                    let posiciones = posicionLetrasPalabra(seleccionado, celda);
                    console.log(posiciones); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

                    let posicionValida = comprobarSeleccionValida(posiciones);
                    console.log(posicionValida); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

                    if (posicionValida) {
                        let palabra = obtenerPalabra(posiciones);
                        console.log(palabra); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

                        let invertida = comprobarPalabraInvertida(palabra)
                        if (comprobarPalabraOrdenada(palabra)) {
                            procesarCorrecta(palabra, posiciones);
                        } else if (invertida) {
                            procesarCorrecta(invertida, posiciones);
                        } else {

                        }
                    }
                    console.log(" - - - - - - - - - - - - - - - - - - - "); // #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
                }

            });

            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    tabla.id = "tablaListener";
    sopaLetras.appendChild(tabla);
}

/**
 *
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones
 * @returns {boolean} `boolean` si es o no valido
 */
export function comprobarSeleccionValida( {primera, ultima} ) {
    let valido = true;
    let dimension = config.dimension;

    if ( valido && (primera.X < 0 || primera.Y < 0 || ultima.X < 0 || ultima.Y < 0) ) {
        valido = false;
    }
    if ( valido && (primera.X > dimension || primera.Y > dimension || ultima.X > dimension || ultima.Y > dimension) ) {
        valido = false;
    }
    if ( valido && (primera.X != ultima.X && primera.Y != ultima.Y) ) {
        if (Math.abs(primera.X - ultima.X) != Math.abs(primera.Y - ultima.Y)) {
            valido = false;
        }
    }

    return valido;
}

/**
 * Devuelve un objeto que contiene la posicion de la primera y ultima celda seleccionada
 * @param {HTMLTableCellElement} primeraCelda
 * @param {HTMLTableCellElement} ultimaCelda
 * @returns { {primera: {X: number, Y: number}, ultima: {X: number, Y: number}} }
 */
export function posicionLetrasPalabra( primeraCelda, ultimaCelda ) {
    return {
        primera: {
            X: primeraCelda.cellIndex,
            Y: primeraCelda.parentNode.rowIndex
        },
        ultima: {
            X: ultimaCelda.cellIndex,
            Y: ultimaCelda.parentNode.rowIndex
        }
    };
}

export function limpiarTablero() {
    const sopaLetras = document.getElementById("sopaLetras");
    const palabras = document.getElementById("palabras");
    let tabla;
    while (tabla = sopaLetras.children[1])  tabla.remove();
    palabras.innerHTML = "";
    config.setFechaInicioTemporizador(null);

    let elementos = [sopaLetras, palabras]

    for (const elemento of elementos) {
        elemento.classList.add('fade-out');
        elemento.classList.remove('fade-in');
        elemento.classList.add("antesAnimacion");
        elemento.classList.remove('despuesAnimacion');
    }
    config.aPalabrasTablero.length = 0
    config.aPalabrasEncontradas.clear();

    btnLimpiarTablero.style.display = "none";

    btnEmpezar.parentElement.style.display = "";
    btnEmpezar.style.display = '';
    btnEmpezar.classList.remove('fade-out');
    btnEmpezar.classList.add('fade-in');

    config.setDificultad(null);
}
