function Canvas (height, width) {
    var canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    document.body.append(canvas);

    this.ctx = canvas.getContext('2d');
}

Canvas.prototype = {

    drawLine: function (x, y, w, z) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(w, z);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#FFF';
        this.ctx.stroke();
    },

    highlightCell: function (cell, cellSize) {
        var x = cell.j * cellSize;
        var y = cell.i * cellSize;

        this.ctx.fillStyle = '#9999ff';
        this.ctx.fillRect(x, y, cellSize, cellSize);

        this.drawWalls(cell, cellSize);
    },

    drawCell: function (cell, cellSize) {
        var x = cell.j * cellSize;
        var y = cell.i * cellSize;

        var color;
        if (cell.visited) color = '#4500B2';
        else color = '#47476b'; 

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, cellSize, cellSize);

        this.drawWalls(cell, cellSize);
    },

    drawWalls: function (cell, cellSize) {
        var x = cell.j * cellSize;
        var y = cell.i * cellSize;

        // Create a top wall if the wall exists.
        if (cell.walls[0]) {
            this.drawLine(x, y, x + cellSize, y);
        }

        // Create a right wall if the wall exists.
        if (cell.walls[1]) {
            this.drawLine(x + cellSize, y, x + cellSize, y + cellSize);
        }

        // Create a bottom wall if the wall exists.
        if (cell.walls[2]) {
            this.drawLine(x + cellSize, y + cellSize, x, y + cellSize);
        }
        
        // Create a left wall if the wall exists.
        if (cell.walls[3]) {
            this.drawLine(x, y + cellSize, x, y);
        }
    }

};
