/* Given a coordinate on the grid, return the corresponding index in the array.
*/
function index (i, j) {
  if ( i < 0 || i > rows - 1 || j < 0 || j > cols - 1) return -1;
  return i * cols + j;
}

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

function generateEdges () {
  edges = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (j != (cols - 1)) {
        let e = new Edge(grid[index(i, j)], grid[index(i, j + 1)]);
        edges.push(e);
      }

      if (i != (rows - 1)) {
        let e = new Edge(grid[index(i + 1, j)], grid[index(i, j)]);
        edges.push(e);
      }
    }
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

  if (!curr) {
    pauseBtn.disabled = true;
    cancelAnimationFrame(requestID);
    return;
  }

  curr.visited = true;
  curr.color = HIGHLIGHT_COLOR;
  drawer.drawCell(curr);

  // Get a random neighbor that has not been visited.
  var next = randomNeighbor(curr.neighbors);

  if (next) {
    // Remove the walls between curr and the neighbor.
    removeWall(curr, next);

    drawer.drawCell(curr);

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
  var canvas = document.getElementById('maze-canvas');

  var height = Math.ceil(window.innerHeight * 0.85);
  var width = Math.ceil(window.innerWidth * 0.85);

  var cellSize = (height > width) ? width * 0.04 : height * 0.04;
  cellSize = Math.floor(cellSize);
  cellSize = (cellSize < 20) ? 20 : cellSize;

  rows = Math.floor(height / cellSize);
  cols = Math.floor(width / cellSize);

  canvas.height = cellSize * rows;
  canvas.width = cellSize * cols;

  drawer  = new Drawer(canvas.getContext("2d"));
  generateCells(height=cellSize, width=cellSize);
  connectNeighbors();
  curr = grid[0][0];
}

function resetCanvas () {
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

var drawer;
var rows, cols;
var grid = [];
var stack = [];

var curr, prev, requestID;

var startBtn = document.getElementById('start');
var pauseBtn = document.getElementById('pause');
var resetBtn = document.getElementById('reset');

window.addEventListener('load', () => {
  startBtn.disabled = false;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  setup();
});

startBtn.addEventListener('click', function (e) {
  this.disabled = true;
  startAnimation();
});

pauseBtn.addEventListener('click', function (e) {
  startBtn.disabled = false;
  cancelAnimationFrame(requestID);
});

resetBtn.addEventListener('click', function (e) {
  resetCanvas();
  stack = [];
  curr = grid[0][0];
  prev = null;

  if (pauseBtn.disabled) pauseBtn.disabled = false;
  startBtn.disabled = false;

  cancelAnimationFrame(requestID);
});
