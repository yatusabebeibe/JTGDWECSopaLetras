// # --- # Arrays para testing # --- #

const palabrasTest = [
    "roca",
    "elefante",
    "bosque"
];
const brrrrr = [
    "brrrrr",
    "veybe",
    "xddd"
];
const palabras = [
  "casa",
  "perro",
  "arbol",
  "libro",
  "sol",
  "luna",
  "coche",
  "niño",
  "escuela",
  "ciudad"
];
const palabras2 = [
  "manzana",
  "perro",
  "gato",
  "casa",
  "escuela",
  "arbol",
  "sol",
  "luna",
  "montana",
  "playa",
  "nino",
  "nina",
  "libro",
  "amigo",
  "mesa",
  "silla",
  "zapato",
  "corazon",
  "coche",
  "reloj",
  "puerta",
  "ventana",
  "pajaro",
  "flor"
];


// # --- # Crear tablero # --- #

const arrayPalabras = palabras2;

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
    } else {
        console.error(palabra, "no ha encontrado sitio valido");
    }
}

pintarTablero(tablero);
rellenarEspaciosTablero(tablero);
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
        [-1, 0],  // 0 ↑
        [-1, 1],  // 1 ↗
        [0, 1],   // 2 →
        [1, 1],   // 3 ↘
        [1, 0],   // 4 ↓
        [1, -1],  // 5 ↙
        [0, -1],  // 6 ←
        [-1, -1]  // 7 ↖
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
        let celda = posCol + i * direcCol;
        
        tablero[fila][celda] = palabra[i];
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
function pintarTablero(tablero) {
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