const sopaLetras = document.getElementById("sopaLetras");
const menuDatos = document.getElementById("menuDatos");

const boton = document.getElementById("boton");

const palabrasTest = new Array(
    "roca",
    "elefante",
    "bosque"
);

const palabras = [
  "casa",
  "perro",
  "árbol",
  "libro",
  "sol",
  "luna",
  "coche",
  "niño",
  "escuela",
  "ciudad"
];


// # --- # Crear tablero # --- #

const arrayPalabras = palabras;

let dimension = calcularDimension(arrayPalabras);
let tablero = crearArrayTablero(dimension);

console.info("dimension: ",dimension);


for (const palabra of arrayPalabras) {
    let nIntentos = 0,
        posicion = 0,
        direccion = 0,
        esValida = false
    ;
    do {
        posicion = calcularPosicionAleatoria(dimension);
        direccion = calcularDireccionAleatoria();
        esValida = comprobarPosicionValida(tablero,palabra,posicion,direccion);

        nIntentos++;
    } while (!esValida && nIntentos < 20);

    if (esValida) {
        escribirPalabra(tablero,palabra,posicion,direccion);
    }    
}

// rellenarEspaciosTablero(tablero)
pintarTablero(tablero);


console.log(tablero);



// # --- # FUNCIONES # --- #

/**
 * <Expicacion>
 * @param {Array} aPalabras - Array de palabras para calcular el alto/ancho minimo.
 * @returns {number} dimension - 
*/
function calcularDimension(aPalabras) {
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
 * @param {number} dimension 
 * @returns {Array} Array del tablero
 */
function crearArrayTablero(dimension) {
    const array = new Array(dimension);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(dimension);
    }
    return array;
}

/**
 * 
 * @param {number} dimension 
 * @returns {{posFila: number, posCol: number}} posicion
 */
function calcularPosicionAleatoria(dimension) {
    return  {
        posFila: parseInt(Math.random()*dimension),
        posCol: parseInt(Math.random()*dimension)
    }
}

/**
 * @returns {{direcFila:number, direcCol:number}} Numero equivalente a una direccion.
 */
function calcularDireccionAleatoria() {
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
 * 
 * @param {Array} tablero 
 * @param {string} palabra 
 * @param {{posFila: number, posCol: number}} posicion
 * @param {{direcFila:number, direcCol:number}} direccion 
 * @returns {boolean}
 */
function comprobarPosicionValida(tablero, palabra, posicion, direccion) {
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
        let letra = posCol + i * direcCol;
        const celda = tablero[fila][letra];
        
        // si no esta en un espacio vacio o la letra no coincide, mal
        if (tablero[fila][letra] != null && tablero[fila][letra] !== palabra[i]) {
            return false;
        }
    }
    return true;
}
/**
 * 
 * @param {Array} tablero 
 * @param {string} palabra 
 * @param {{posFila: number, posCol: number}} posicion
 * @param {{direcFila:number, direcCol:number}} direccion 
 */
function escribirPalabra(tablero, palabra, posicion, direccion) {
    const {posFila, posCol} = posicion;
    const {direcFila, direcCol} = direccion;

    for (let i = 0; i < palabra.length; i++){
        let fila = posFila + i * direcFila;
        let letra = posCol + i * direcCol;
        
        tablero[fila][letra] = palabra[i];
    }
}

/**
 * 
 * @param {Array} tablero 
 * @returns Array rellenado con letras
 */
function rellenarEspaciosTablero(tablero) {
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
                let aleatorio = Math.random();
                if (aleatorio < 0.7) {
                    tablero[i][j] = consonantes[parseInt(Math.random() * consonantes.length)].toLowerCase();
                } else {
                    tablero[i][j] = vocales[parseInt(Math.random() * vocales.length)].toLowerCase();
                }
            }
        }
    }
}
function pintarTablero(tablero) {
    let tabla = document.createElement("table");

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