function setup () {

    // Compute the number of columns and rows for the 'grid'.
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);

    console.log(rows);
    console.log(cols);

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {

            // Create a new Cell object and display it on the canvas.
            var cell = new Cell(x, y);
            cell.show();

            // Save the Cell.
            grid.push(cell);
        }
    }

    console.log(grid);


    // Connect the cells with their neighbors (i.e. the adjacent cells).
    for (let i = 0; i < grid.length; i++) {
        x = grid[i].x;
        y = grid[i].y;

        var neighbors = [grid[index(x - 1, y)], grid[index(x + 1, y)], 
                         grid[index(x, y - 1)], grid[index(x, y + 1)]];

        for (let j = 0; j < neighbors.length; j++) {
            grid[i].addNeighbor(neighbors[j]);
        }
    }

    DFS(0,0);
}


/* Given a coordinate on the grid, return the corresponding index in the grid 
 * array.
 */
function index (x, y) {
    if ( x < 0 || x > rows - 1 || y < 0 || y > cols - 1) return -1;
    return x * cols + y;
}


function DFS (x, y) {
    var curr = grid[index(x, y)];
    curr.visited = true;
    curr.show();

    var next = curr.randomNeighbor();

    if (next) {
       setTimeout( function () {
           DFS(next.x, next.y);
       }, 250);
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
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFF';
    ctx.stroke();
}

class Cell {

    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true];
        this.visited = false;
        this.neighbors = [];
    }

    show () {
        var i = this.y*cellSize;
        var j = this.x*cellSize;

        if (this.visited) {
            ctx.fillStyle = '#4500B2';
            ctx.fillRect(i, j, cellSize, cellSize);
        }

        if (this.walls[0]) line(i, j, i + cellSize, j);
        if (this.walls[1]) line(i + cellSize, j, i + cellSize, j + cellSize);
        if (this.walls[2]) line(i + cellSize, j + cellSize, i, j + cellSize);
        if (this.walls[3]) line(i, j + cellSize, i, j);
    }

    addNeighbor (cell) {
        if (cell) this.neighbors.push(cell);
    }

    randomNeighbor () {
        var validNeighbors = [];

        for (let i = 0; i < this.neighbors.length; i++) {
            if (!this.neighbors[i].visited) {
                validNeighbors.push(this.neighbors[i]);
            }
        }

        if (validNeighbors.length > 0) {
            var max = validNeighbors.length - 1;
            var min = 0;

            var index = Math.floor(Math.random() * (max - min + 1) + min);
            return validNeighbors[index];
        }
    }
}


var cols, rows;
var cellSize = 50;
var grid = [];

var canvas = createCanvas(600, 400);
var ctx = canvas.getContext('2d');
background(canvas, '#47476b');
document.body.appendChild(canvas);

setup();
