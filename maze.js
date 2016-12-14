function createCanvas (h, w) {
    let canvas = document.createElement('canvas');
    canvas.height = h;
    canvas.width = w;

    return canvas;
}

var canvas = createCanvas(500, 500);
document.body.appendChild(canvas);
