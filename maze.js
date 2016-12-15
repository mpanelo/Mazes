function setup () {

    // Compute the number of columns and rows for the 'grid'.
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {

            // Create a new Cell object and display it on the canvas.
            var cell = new Cell(x, y);
            cell.show();

            // Save the Cell.
            grid.push(cell);
        }
    }

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

    // Set the initial cell to be the most top-left cell.
    curr = grid[0];
    // start thte animation.
    window.requestAnimationFrame(backtracker);
}


/* Given a coordinate on the grid, return the corresponding index in the grid 
 * array.
 */
function index (x, y) {
    if ( x < 0 || x > rows - 1 || y < 0 || y > cols - 1) return -1;
    return x * cols + y;
}


function backtracker () {
    if (prev) {
        prev.current = false;
        prev.show();
    }

    curr.visited = true;
    curr.current = true;
    curr.show();

    var next = curr.randomNeighbor();

    if (next) {
        removeWalls(curr, next);
        curr.show();

        stack.push(curr);
        prev = curr;
        curr = next;
    }
    else {
        prev = curr;
        curr = stack.pop();
    }

    window.requestAnimationFrame(backtracker);
}


function removeWalls(cellA, cellB) {
    var i = cellA.y - cellB.y;

    if (i === 1) {
        cellA.walls[3] = false;
        cellB.walls[1] = false;
    }
    else if (i === -1) {
        cellA.walls[1] = false;
        cellB.walls[3] = false;
    }

    var j = cellA.x - cellB.x;

    if (j === 1) {
        cellA.walls[0] = false;
        cellB.walls[2] = false;
    }
    else if (j === -1) {
        cellA.walls[2] = false;
        cellB.walls[0] = false;
    }
}


function createCanvas (h, w) {
    var canvas = document.createElement('canvas');
    canvas.height = h;
    canvas.width = w;

    return canvas;
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
        this.current = false;
        this.neighbors = [];
    }

    show () {
        var i = this.y*cellSize;
        var j = this.x*cellSize;

        if (this.current) ctx.fillStyle = '#9999ff';
        else if (this.visited) ctx.fillStyle = '#4500B2';
        else ctx.fillStyle = '#47476b'; 

        ctx.fillRect(i, j, cellSize, cellSize);

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

var canvas = createCanvas(600, 1000);
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');
ctx.rect(0, 0, canvas.width, canvas.height);

var curr, prev;
var stack = [];
setup();

