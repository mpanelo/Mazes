function setup () {
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            var cell = new Cell(x, y);
            grid.push(cell);
        }
    }
}

function displayCells () {
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
}


function createCanvas (h, w) {
    var canvas = document.createElement('canvas');
    canvas.height = h;
    canvas.width = w;

    return canvas;
}

function background (canvas, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width, canvas.height);
}


function line (startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FF5733';
    ctx.stroke();
}

class Cell {

    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true];
    }

    show () {
        let canvasX = this.x*cellSize;
        let canvasY = this.y*cellSize;
        ctx.fillRect(canvasX, canvasY, cellSize, cellSize);
        line(canvasX, canvasY, canvasX + cellSize, canvasY);
        line(canvasX + cellSize, canvasY, canvasX + cellSize, canvasY + cellSize);
        line(canvasX + cellSize, canvasY + cellSize, canvasX, canvasY + cellSize);
        line(canvasX, canvasY + cellSize, canvasX, canvasY);
    }
}


var cols, rows;
var cellSize = 50;
var grid = [];

var canvas = createCanvas(500, 500);
var ctx = canvas.getContext('2d');
background(canvas, '#581845');
document.body.appendChild(canvas);

setup();
displayCells();
