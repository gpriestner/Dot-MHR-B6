// #region Init
const canvas = document.querySelector("canvas");
canvas.view = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.view.lineWidth = 10;
canvas.view.font = "24px Arial";
// #endregion
// #region Utils
function dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y; }
function distance(x1, y1, x2, y2) { return Math.sqrt((x1-x2)**2 + (y1-y2)**2); }
function normalizeVector(v) {
    const dist = distance(0, 0, v.x, v.y);
    return { x: v.x / dist, y: v.y / dist };
}
// #endregion
// #region Mouse events
addEventListener("mousedown", e => {
    for(const p of Point.Points) {
        if (distance(p.x, p.y, e.clientX, e.clientY) <= p.radius) Point.Active = p;
    }
});
addEventListener("mouseup", e => { Point.Active = null; });
addEventListener("mousemove", e => {
    if (Point.Active) {
        Point.Active.x = e.clientX;
        Point.Active.y = e.clientY;
    }
});
// #endregion
class Point {
    static Points = [];
    static Active = null;
    constructor(line, x, y, r = 20, c = "orangered") {
        Point.Points.push(this);
        this.x = x;
        this.y = y,
        this.radius = r;
        this.color = c;
        this.line = line;
    }
    draw() {
        canvas.view.beginPath();
        canvas.view.fillStyle = this.color;
        canvas.view.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        canvas.view.fill();
    }
}

class Line {
    static Lines = [];
    constructor(x, y) {
        Line.Lines.push(this);
        this.p1 = new Point(this, x - 100, y);
        this.p2 = new Point(this, x + 100, y);
    }
    get vector() { return { x: this.p2.x - this.p1.x, y: this.p2.y - this.p1.y } };
    get unitVector() { return normalizeVector(this.vector); };
    draw() {
        canvas.view.strokeStyle = "black";
        canvas.view.beginPath();
        canvas.view.moveTo(this.p1.x, this.p1.y);
        canvas.view.lineTo(this.p2.x, this.p2.y);
        canvas.view.stroke();
        this.p1.draw();
        this.p2.draw();
    }
}


const line1 = new Line(300, 300);
const line2 = new Line(400, 400);

const v = canvas.view;

function animate() {
    canvas.view.clearRect(0, 0, canvas.width, canvas.height);
    for(const line of Line.Lines) line.draw();


    v.fillStyle = "black";
    v.fillText(`line1 P1 x: ${line1.p1.x}  y: ${line1.p1.y}`, 20, 20);
    v.fillText(`line1 P2 x: ${line1.p2.x}  y: ${line1.p2.y}`, 20, 40);
    v.fillText(`line2 P1 x: ${line2.p1.x}  y: ${line2.p1.y}`, 20, 60);
    v.fillText(`line2 P2 x: ${line2.p2.x}  y: ${line2.p2.y}`, 20, 80);
    v.fillText(`line1 vector x: ${line1.vector.x}  y: ${line1.vector.y}`, 20, 100);
    v.fillText(`line2 vector x: ${line2.vector.x}  y: ${line2.vector.y}`, 20, 120);
    v.fillText(`line1 unit vector x: ${line1.unitVector.x.toFixed(2)}  y: ${line1.unitVector.y.toFixed(2)}`, 20, 140);
    v.fillText(`line2 unit vector x: ${line2.unitVector.x.toFixed(2)}  y: ${line2.unitVector.y.toFixed(2)}`, 20, 160);

    const dp = dot(line1.unitVector, line2.unitVector);
    v.fillText(`Dot Product: ${dp.toFixed(3)}`, 20, 200);

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
