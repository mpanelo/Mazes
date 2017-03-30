function Drawer(context) {
  this.ctx = context;
}

Drawer.prototype = {
  drawLine: function (x, y, w, z) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(w, z);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#FFF';
    this.ctx.stroke();
  },

  drawCell: function (cell) {
    var x = cell.x * cell.width;
    var y = cell.y * cell.height;

    this.ctx.clearRect(x, y, cell.width, cell.height);
    this.ctx.fillStyle = cell.color;
    this.ctx.fillRect(x, y, cell.width, cell.height);
    this.drawWalls(cell);
  },

  drawWalls: function (cell) {
    var x = cell.x * cell.width;
    var y = cell.y * cell.height;

    // Create a top wall if the wall exists.
    if (cell.walls["top"]) {
      this.drawLine(x, y, x + cell.width, y);
    }

    // Create a right wall if the wall exists.
    if (cell.walls["right"]) {
      this.drawLine(x + cell.width, y, x + cell.width, y + cell.height);
    }

    // Create a bottom wall if the wall exists.
    if (cell.walls["bottom"]) {
      this.drawLine(x + cell.width, y + cell.height, x, y + cell.height);
    }

    // Create a left wall if the wall exists.
    if (cell.walls["left"]) {
      this.drawLine(x, y + cell.height, x, y);
    }
  }
};
