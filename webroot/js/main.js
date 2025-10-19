const sopaLetras = document.getElementById("sopaLetras");

const arrayTablero = crearArrayTablero(3,6);

console.log(arrayTablero);










function crearArrayTablero(filas, elementos) {

    const array = new Array(filas);

    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(elementos);
    }

    return array;
}