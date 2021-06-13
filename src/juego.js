var canvas;
var ctx;
var fps = 30;

var canvasX = 500;
var canvasY = 500;

var tileX, tileY;

//Variables relacionadas con el tablero
var tablero;
var filas = 100;
var columnas = 100;

var blanco = '#FFFFFF';
var negro = '#000000';

function creaArray2D(filas, columnas) {
    var obj = new Array(filas);
    for( var y = 0; y < filas; y++){
        obj[y] = new Array(columnas);
    }

    return obj;
}

//El agente inteligente
var Agente = function (x, y, estado) {
    this.x = x;
    this.y = y;
    this.estado = estado;  // vivo = 1, muerto = 2
    this.estadoProx = this.estado;  //estado que tendrá en el siguiente ciclo

    this.vecinos = []; //Listado de vecinos que tendrá el agente

    //Método para añadir los vecinos del objeto actual 
    this.addVecinos = function () {
        var xVecino, yVecino;
        for(var i= -1; i < 2; i++){
            for(var j= -1; j < 2; j++){
                xVecino = (this.x + j + columnas) % columnas;
                yVecino = (this.y + i + filas) % filas;

                //Descartamos el agente actual
                if(i != 0 || j != 0 ){
                    this.vecinos.push(tablero[yVecino][xVecino]);
                }
            }
        }
    }

    this.dibuja = function () {
        var color;
        if(this.estado == 1){
            color = blanco;

        }else{
            color = negro;
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x*tileX, this.y * tileY, tileX, tileY);
    }

    //Programar las leyes de Conway
    this.nuevoCiclo = function () {
        var suma = 0;

        //calculamos la cantidad de vecinos vivos
        for(var i=0; i < this.vecinos.length; i++){
            suma += this.vecinos[i].estado;
        }

        //Aplicamos normas
        this.estadoProx = this.estado;
        
        //MUERTE: tiene menos de 2 o más de 3
        if(suma < 2 || suma > 3){
            this.estadoProx = 0;
        }

        //VIDA/REPRO
        if(suma == 3) this.estadoProx=1;

    }

    this.mutacion = function () {
        this.estado = this.estadoProx;
    }
}

function inicializaTablero(obj) {
    var estado;
    for(var i=0; i < filas; i++){
        for(var j=0; j < columnas; j++){
            estado = Math.floor(Math.random()*2);
            obj[i][j] = new Agente(j, i, estado)
        }
    }

    for(var i=0; i < filas; i++){
        for(var j=0; j < columnas; j++){
            obj[i][j].addVecinos()
        }
    }
}


function inicializa(){
    //Asociamos el canvas
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    //Ajustamos el tamaño del canvas
    canvas.width = canvasX;
    canvas.height = canvasY;

    //Calculamos el tamañp de tiles
    tileX = Math.floor(canvasX/filas);
    tileY = Math.floor(canvasY/columnas);

    //creamos el tablero
    tablero = creaArray2D(filas, columnas);
    inicializaTablero(tablero);


    //Bucle principal
    //principal();
    setInterval(function () {
        principal();
    }, 1000/fps);
}

function dibujaTablero(obj) {
    //dibuja los agentes
    for(var i=0; i < filas; i++){
        for(var j=0; j < columnas; j++){
            obj[i][j].dibuja();
        }
    }

    //Calcula el siguiente ciclo
    for(var i=0; i < filas; i++){
        for(var j=0; j < columnas; j++){
            obj[i][j].nuevoCiclo();
        }
    }

    //aplica la mutación
    for(var i=0; i < filas; i++){
        for(var j=0; j < columnas; j++){
            obj[i][j].mutacion();
        }
    }
}

function borraCanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function principal() {
    borraCanvas();
    dibujaTablero(tablero);
}