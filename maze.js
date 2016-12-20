'use strict';


/* Given a coordinate on the grid, return the corresponding index in the grid 
 * array.
 */
function index (i, j) {
    if ( i < 0 || i > rows - 1 || j < 0 || j > cols - 1) return -1;
    return i * cols + j;
}

function randomNeighbor (neighbors) {
    var validNeighbors = [];

    for (let i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].visited) {
            validNeighbors.push(neighbors[i]);
        }
    }

    if (validNeighbors.length > 0) {
        var max = validNeighbors.length - 1;
        var min = 0;

        var index = Math.floor(Math.random() * (max - min + 1) + min);
        return validNeighbors[index];
    }
}

function generateGrid () {
    grid = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            // Create a new Cell Object and display it on the canvas.
            var cell = new Cell(i,j);
            context.drawCell(cell, cellSize);

            // Save the cell.
            grid.push(cell);
        }
    }
}

function connectNeighbors () {
    for (let x = 0; x < grid.length; x++) {
        var i = grid[x].i;
        var j = grid[x].j;

        var neighbors = [grid[index(i - 1, j)], grid[index(i + 1, j)], 
                         grid[index(i, j - 1)], grid[index(i, j + 1)]];

        for (let y = 0; y < neighbors.length; y++) {
            if (neighbors[y]) {
                grid[x].neighbors.push(neighbors[y]);
            }
        }
    }
}

function removeWall(thisCell, thatCell) {
    var x = thisCell.j - thatCell.j;
    var y = thisCell.i - thatCell.i;

    if (x !== 0) {
        if (x === 1) {
            thisCell.walls[3] = false;
            thatCell.walls[1] = false;
        }
        else {
            thisCell.walls[1] = false;
            thatCell.walls[3] = false;
        }
    }
    else {
        if (y === 1) {
            thisCell.walls[0] = false;
            thatCell.walls[2] = false;
        }
        else {
            thisCell.walls[2] = false;
            thatCell.walls[0] = false;
        }
    }
}

/* Modified version of the recursive backtracking/depth first search algorithm.
 */
function backtracker () {
    requestID = requestAnimationFrame(backtracker);

    // Remove the highlight color of the previous visited cell
    if (prev) {
        context.drawCell(prev, cellSize);
    }

    if (!curr) {
        pauseBttn.disabled = true;
        cancelAnimationFrame(requestID);
        return;
    }

    curr.visited = true;
    context.highlightCell(curr, cellSize);

    // Get a random neighbor that has not been visited.
    var next = randomNeighbor(curr.neighbors);

    if (next) {
        // Remove the walls between curr and the neighbor.
        removeWall(curr, next);

        context.highlightCell(curr, cellSize);
        
        stack.push(curr);
        prev = curr;
        curr = next;
    }
    // There are no neighbors that have not been visited, so start backtracking.
    else {
        prev = curr;
        curr = stack.pop();
    }
}


function setup () {
    canvas = document.getElementById('backtracker');

    height = document.getElementById('height').value;
    width = document.getElementById('width').value;
    canvas.height = height;
    canvas.width = width;

    rows = Math.floor(height / cellSize);
    cols = Math.floor(width / cellSize);

    context = new Context(canvas);

    generateGrid();
    connectNeighbors();
    curr = grid[0];
}

function resetCanvas () {
    for (let i = 0; i < grid.length; i++) {
        grid[i].walls = [true, true, true, true];
        grid[i].visited = false;
        context.drawCell(grid[i], cellSize);
    }
}

function startAnimation () {
    requestID = requestAnimationFrame(backtracker);
}

function Cell (i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;

    // Wall order: top, right, bottom, left
    this.walls = [true, true, true, true];

    // The neighbors of the cell
    this.neighbors = [];
}

var canvas, context;
var height, width;
var cellSize = 50;
var rows, cols;
var grid;
var stack = [];

var curr, prev, requestID;

/************** Needs Work *****************/

var submitBttn = document.getElementById('submit');
submitBttn.disabled = false;

var startBttn = document.getElementById('start');
startBttn.disabled = false;

var pauseBttn = document.getElementById('pause');
pauseBttn.disabled = false;

var resetBttn = document.getElementById('reset');

submitBttn.addEventListener('click', function (e) {
    setup();
});

startBttn.addEventListener('click', function (e) {
    this.disabled = true;
    submitBttn.disabled = true;
    startAnimation();
});

pauseBttn.addEventListener('click', function (e) {
    startBttn.disabled = false;
    cancelAnimationFrame(requestID);
});

resetBttn.addEventListener('click', function (e) {
    resetCanvas();
    stack = [];
    if (pauseBttn.disabled) {
        pauseBttn.disabled = false;
        startBttn.disabled = false;
    }
    curr = grid[0];

    startBttn.disabled = false;
    submitBttn.disabled = false;
    cancelAnimationFrame(requestID);
});
