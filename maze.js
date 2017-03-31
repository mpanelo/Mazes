/* Return a random neighbor that has not been visited
*/
function randomNeighbor (neighbors) {
  var validNeighbors = neighbors.filter((node) => {
    if (!node.visited) return node;
  });

  if (validNeighbors.length > 0) {
    var max = validNeighbors.length - 1;
    var min = 0;

    var index = Math.floor(Math.random() * (max - min + 1) + min);
    return validNeighbors[index];
  }
}

function generateCells(width, height) {
  for (var x = 0; x < rows; x++) {
    var row = [];
    for (let y = 0; y < cols; y++) {
      var cell = new Cell(y, x);
      cell.width = width;
      cell.height = height;
      row.push(cell);
      drawer.drawCell(cell);
    }
    grid.push(row);
  }
}

function connectNeighbors () {
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      var neighbors = []
      if (x - 1 > -1)
        neighbors.push(grid[x - 1][y])
      if (x + 1 < grid.length)
        neighbors.push(grid[x + 1][y])
      if (y - 1 > -1)
        neighbors.push(grid[x][y - 1])
      if (y + 1 < grid[x].length)
        neighbors.push(grid[x][y + 1])

      grid[x][y].neighbors = neighbors.slice();
    }
  }
}

function removeWall(cellA, cellB) {
  var x = cellA.x - cellB.x;
  var y = cellA.y - cellB.y;

  if (x != 0) {
    if (x == 1) {
      cellA.walls["left"] = false;
      cellB.walls["right"] = false;
    }
    else {
      cellA.walls["right"] = false;
      cellB.walls["left"] = false;
    }
  }
  else {
    if (y == 1) {
      cellA.walls["top"] = false;
      cellB.walls["bottom"] = false;
    }
    else {
      cellA.walls["bottom"] = false;
      cellB.walls["top"] = false;
    }
  }
}

/* Modified version of the recursive backtracking/depth first search algorithm.
*/
function backtracker () {
  requestID = requestAnimationFrame(backtracker);

  // Remove the highlight color of the previous visited cell
  if (prev) {
    prev.color = VISITED_COLOR;
    drawer.drawCell(prev);
  }

  curr.visited = true;
  curr.color = HIGHLIGHT_COLOR;
  drawer.drawCell(curr);

  // Get a random neighbor that has not been visited.
  var next = randomNeighbor(curr.neighbors);

  if (next) {
    // Remove the wall between curr and the neighbor.
    removeWall(curr, next);

    drawer.drawCell(curr);

    stack.push(curr);
    prev = curr;
    curr = next;
  }
  // There are no neighbors that have not been visited, so start backtracking.
  else {
    // Backtrack as long as there are elements in the stack. 
    // Otherwise, cancel the animation.
    if (stack.length > 0) {
      prev = curr;
      curr = stack.pop();
    } else {
      curr.color = VISITED_COLOR;
      drawer.drawCell(curr);
      cancelAnimationFrame(requestID);
    }
  }
}

function initValues () {
  grid = [];
  stack = [];

  var height = Math.ceil(window.innerHeight * 0.75);
  var width = Math.ceil(window.innerWidth * 0.85);

  var cellSize = (height > width) ? width * percentage : height * percentage;
  cellSize = Math.floor(cellSize);
  cellSize = (cellSize < 20) ? 20 : cellSize;

  rows = Math.floor(height / cellSize);
  cols = Math.floor(width / cellSize);

  canvas.height = cellSize * rows;
  canvas.width = cellSize * cols;

  generateCells(height=cellSize, width=cellSize);
  connectNeighbors();

  curr = grid[0][0];
  prev = null;
}

function resetCells () {
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.visited = false;
      cell.color = DEFAULT_COLOR;
      cell.walls = {"top": true, "right": true, "bottom": true, "left": true};
      drawer.drawCell(cell);
    });
  });
}

function startAnimation () {
  if (!requestID)
    requestID = requestAnimationFrame(backtracker);
}

function Cell(x, y) {
  // Coordinates on the canvas
  this.x = x;
  this.y = y;

  this.visited = false;
  this.color = DEFAULT_COLOR;

  this.walls = {
    "top":    true,
    "right":  true,
    "bottom": true,
    "left":   true
  };
}

const DEFAULT_COLOR = "#47476b"
const HIGHLIGHT_COLOR = "#9999ff";
const VISITED_COLOR = "#4500B2";

const canvas = document.getElementById("maze-canvas");
const drawer = new Drawer(canvas.getContext("2d"));

var rows, cols;
var grid, stack;

var curr, prev, requestID, percentage;
percentage = 0.04;

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

const lgCellBtn = document.getElementById('lg-cells');
const mdCellBtn = document.getElementById('md-cells');
const smCellBtn = document.getElementById('sm-cells');

window.addEventListener('load', () => {
  initValues();
});

startBtn.addEventListener('click', (e) => {
  startAnimation();
});

pauseBtn.addEventListener('click', (e) => {
  cancelAnimationFrame(requestID);
  requestID = null;
});

resetBtn.addEventListener('click', (e) => {
  resetCells();
  stack = [];
  curr = grid[0][0];
  prev = null;

  cancelAnimationFrame(requestID);
  requestID = null;
});

function updateValues (e) {
  percentage = Number(e.target.value);
  initValues();
  if (requestID)
    cancelAnimationFrame(requestID);
  requestID = null;
}

lgCellBtn.addEventListener('click', updateValues);

mdCellBtn.addEventListener('click', updateValues);

smCellBtn.addEventListener('click', updateValues);
