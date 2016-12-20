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
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            // Create a new Cell Object and display it on the canvas.
            var cell = new Cell(i,j);
            canvas.drawCell(cell, cellSize);

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
    // Remove the highlight color of the previous visited cell
    if (prev) {
        canvas.drawCell(prev, cellSize);
    }

    if (!curr) return;

    curr.visited = true;
    canvas.highlightCell(curr, cellSize);

    // Get a random neighbor that has not been visited.
    var next = randomNeighbor(curr.neighbors);

    if (next) {
        // Remove the walls between curr and the neighbor.
        removeWall(curr, next);

        canvas.highlightCell(curr, cellSize);
        
        stack.push(curr);
        prev = curr;
        curr = next;
    }
    // There are no neighbors that have not been visited, so start backtracking.
    else {
        prev = curr;
        curr = stack.pop();
    }

    window.requestAnimationFrame(backtracker);
}


function startAnimation () {
    generateGrid();
    connectNeighbors();

    curr = grid[0];
    window.requestAnimationFrame(backtracker);
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

var height = 600;
var width = 1000;
var cellSize = 50;

// Canvas for the recursive backtracking algorithm
var canvas = new Canvas(height, width);

var cols = Math.floor(width / cellSize);
var rows = Math.floor(height / cellSize);

var grid = []; 
var stack = [];

var curr, prev;
startAnimation();
