// # --- # Arrays para testing # --- #

const palabras2 = [
    "roca",
    "elefante",
    "bosque",
    // "casa",
    // "perro",
    "arbol",
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

// # --- # Variables Globales # --- #

/** @type boolean - si ha terminado o no */
var aTerminado = false;

/** @type Date - fecha y hora en la que inniciamos la sopa de letra */
var fechaInicioTemporizador = null;

/** @type number - alto y ancho de la sopa de letra */
var dimension = 0;

/** @type Set<string> - lista con las palabras que vamos a usar para generar la sopa de letras */
var listaPalabras = null;

// # --- # Lintener Boton iniciar # --- #

const btn = document.getElementById('btnEmpezar');
btn.addEventListener('click', () => {
    aTerminado = false;

    // 1. Hacer fade out del botón
    btn.classList.add('fade-out');

    empezar();

    // 2. Al terminar la animación del botón
    btn.addEventListener('animationend', function ocultarBtn() {
        fechaInicioTemporizador = new Date();
        btn.style.display = 'none';
        btn.removeEventListener('animationend', ocultarBtn);

        let elementos = ["sopaLetras", "palabras"];

        for (const element of elementos) {
            let elemento = document.getElementById(element);
            elemento.classList.add('fade-in');
            elemento.classList.add('despuesAnimacion');
            elemento.classList.remove("antesAnimacion");
        }
    });
});

// # --- # Inicio Arrays # --- #

const aPalabrasTablero = []
const aPalabrasEncontradas = new Set();

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

function empezar() {
    listaPalabras = new Set(palabras2);

    dimension = calcularDimension(listaPalabras);
    let tablero = crearArrayTablero(dimension);

    console.info("dimension: ",dimension);

    for (const palabra of listaPalabras) {
        let nIntentos = 0,
            posicion = null,
            direccion = 0,
            esValida = false
        ;
        do {
            posicion = calcularPosicionAleatoria(dimension);
            direccion = calcularDireccionAleatoria();
            esValida = comprobarPosicionValida(tablero,palabra,posicion,direccion);

            nIntentos++;
        } while (!esValida && nIntentos < 50);

        if (esValida) {
            aPalabrasTablero.push(palabra)
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

// # --- # Tabla puntuacion # --- #

añadirPuntuacion("yokese", 29);
generarTablaPuntuaciones();

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

/**
 * Pinta el tablero en el DOM
 * @param {string[]} tablero
 */
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

/**
 * Pinta el tablero en el DOM añadiendo event Listener a cada celda
 * @param {string[]} tablero
 */
function pintarTableroLinstener(tablero) {
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

                        if (comprobarPalabraOrdenada(palabra)) {
                            procesarCorrecta(palabra, posiciones);
                        } else if (invertida = comprobarPalabraInvertida(palabra)) {
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
 * Devuelve un objeto que contiene la posicion de la primera y ultima celda seleccionada
 * @param {HTMLTableCellElement} primeraCelda
 * @param {HTMLTableCellElement} ultimaCelda
 * @returns { {primera: {X: number, Y: number}, ultima: {X: number, Y: number}} }
 */
function posicionLetrasPalabra( primeraCelda, ultimaCelda ) {
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

/**
 *
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones
 * @returns {boolean} `boolean` si es o no valido
 */
function comprobarSeleccionValida( {primera, ultima} ) {
    let valido = true;

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
 * Obtiene la palabra en el orden de la seleccion
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones
 * @returns {string} `string` La palabra seleccionada
 */
function obtenerPalabra( { primera, ultima } ) {
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
function pintarPalabra( { primera, ultima } ) {
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
 * Comprueba si la palabra seleccionada era una de las que habia que encontrar
 * @param {string} palabra La palabra a comprobar
 * @returns {boolean} Si esxiste o no
 */
function comprobarPalabraOrdenada( palabra ) {
    return listaPalabras.has(palabra);
}

/**
 * Comprueba si la palabra seleccionada se ha seleccionado al reves y era una de las que habia que encontrar
 * @param {string} palabra
 * @returns {string|false} La palabra invertida o falso si no es una palabra a buscar
 */
function comprobarPalabraInvertida( palabra ) {
    let invertida = palabra.split("").reverse().join("");
    return listaPalabras.has(invertida) ? invertida : false;
}

/**
 * Obtiene todas las puntuaciones almacenadas en localStorage.
 * @returns {Array<{nombre: string, puntuacion: number}>} Array de objetos con nombre y puntuación.
 */
function obtenerPuntuaciones() {
    return JSON.parse(sessionStorage.getItem("puntuaciones")) || [];
}

/**
 * Añade una nueva puntuación si no existe o es mejor y mantiene el array ordenado de mayor a menor.
 * @param {string} nombre - Nombre del usuario.
 * @param {number} puntuacion - Puntuación obtenida por el jugador.
 */
function añadirPuntuacion(nombre, puntuacion) {
    let puntuaciones = obtenerPuntuaciones();

    let usuario = puntuaciones.find(u => u.nombre === nombre);

    if (usuario) {
        if (puntuacion > usuario.puntuacion) {
            usuario.puntuacion = puntuacion;
        }
    } else {
        puntuaciones.push({ nombre, puntuacion });
    }

    puntuaciones.sort((a, b) => b.puntuacion - a.puntuacion);

    sessionStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
}

/**
 * Rellena la tabla de puntuaciones en el HTML con los datos almacenados en localStorage.
 * La tabla debe tener un tbody dentro de #puntuaciones.
 */
function generarTablaPuntuaciones() {
    let puntuaciones = obtenerPuntuaciones();
    let tbody = document.querySelector("#puntuaciones tbody");
    console.log(tbody);


    tbody.innerHTML = "";

    puntuaciones.forEach( (puntuacion, indice) => {
        let fila = document.createElement("tr");

        let celdaN = document.createElement("td");
        let celdaNom = document.createElement("td");
        let celdaPun = document.createElement("td");

        celdaN.textContent = indice + 1;
        fila.appendChild(celdaN);

        celdaNom.textContent = puntuacion.nombre;
        fila.appendChild(celdaNom);

        celdaPun.textContent = puntuacion.puntuacion;
        fila.appendChild(celdaPun);

        tbody.appendChild(fila);
    });
}

/**
 * Calcula el tiempo aprox en segundos segun el número de palabras.
 * El tiempo por palabra aumenta según la cantidad total de palabras
 * y se aplica por igual a todas ellas.
 *
 * @param {number} numPalabras Número total de palabras en la sopa.
 * @returns {number} Tiempo máximo total en segundos.
 */
function calcularTiempoMaximo(numPalabras) {
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
function calcularPuntuacion() {
    const encontradas = [...aPalabrasEncontradas].filter(palabra => aPalabrasTablero.includes(palabra)).length;

    let puntuacion = encontradas * 10;

    const nENCONTRADAS = aPalabrasEncontradas.size;
    const nEN_SOPA = aPalabrasTablero.length;

    puntuacion *= ( (calcularTiempoMaximo(nENCONTRADAS) - temporizador()) / calcularTiempoMaximo(nEN_SOPA) ) + 1;

    if ( nENCONTRADAS < nEN_SOPA ) {
        let factor = nENCONTRADAS / nEN_SOPA;
        puntuacion *= Math.max(factor, 0.7);
    }

    return Math.round(puntuacion);
}

/**
 * Muestra en el DOM la lista de palabras de la sopa de letras,
 * marcando las que ya han sido encontradas.
 */
function palabras() {
    let elementoListaPalabras = document.getElementById("palabras");

    elementoListaPalabras.innerHTML = "";

    for (const palabra of aPalabrasTablero) {
        let pPalabra = document.createElement("p");

        pPalabra.innerText = palabra;

        if (aPalabrasEncontradas.has(palabra))  pPalabra.classList.add("encontrada");

        elementoListaPalabras.appendChild(pPalabra);
    }
}

/**
 * Procesa una palabra correcta encontrada en la sopa de letras.
 *
 * @param {string} palabra La palabra que se ha encontrado.
 * @param {{primera: {X: number, Y: number}, ultima: {X: number, Y: number}}} posiciones Posiciones de la primera y última letra de la palabra en el tablero.
 */
function procesarCorrecta(palabra, posiciones) {
    aPalabrasEncontradas.add(palabra);
    pintarPalabra(posiciones);
    palabras();

    if (aPalabrasEncontradas.size == aPalabrasTablero.length) {
        // Aqui iria lo que pasa al terminar
        terminar();
    }
}

/**
 * Termina la partida, pide el nombre del jugador y guarda su puntuación.
 */
function terminar() {
    const puntuacion = calcularPuntuacion();
    const nombre = prompt("¡Has ganado!.\nIntroduce tu nombre para añadir tu puntuacion a la tabla").trim() || "Desconocido";

    añadirPuntuacion(nombre, puntuacion);
    generarTablaPuntuaciones();
}

/**
 * Funcion para obtener la hora local formateada
 * @returns string
 */
function obtenerHoraActual() {
    const instante = new Date();

    return instante.toLocaleTimeString();
}

/**
 * Devuelve el num de seg desde que se empezo la sopa de letras
 * @returns {int} segundos desde que se empezo la sopa de letras
 */
function temporizador() {
    segundos = parseInt( ( (new Date()) - fechaInicioTemporizador ) / 1000 );
    segundos = fechaInicioTemporizador ? segundos : 0;

    return segundos;
}