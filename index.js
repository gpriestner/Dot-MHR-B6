console.log("working");
const canvas = document.querySelector("canvas");
const view = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
view.lineWidth = 10;
view.font = "30px Arial";
view.lineCap = "round";
//#region Util functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
}
function dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y; }
function normalizeVector(v) {
    const dist = Math.sqrt(v.x**2 + v.y**2);
    return { x: v.x / dist, y: v.y / dist };
}
function addVector(v1, v2) { return { x: v1.x + v2.x, y: v1.y + v2.y }; }
function subtractVector(v1, v2) { return { x: v1.x - v2.x, y: v1.y - v2.y }; } // v1 -> v2
function multiplyVector(v, f) { return { x: v.x * f, y: v.y * f }; }
//#endregion
addEventListener("mousedown", e => {
    for (const p of Point.Points) {
        if (distance(e.clientX, e.clientY, p.x, p.y) <= p.radius) Point.Active = p;
    }
});
addEventListener("mouseup", e => Point.Active = null);
addEventListener("mousemove", e => {
    if (Point.Active) {
        Point.Active.x = e.clientX;
        Point.Active.y = e.clientY;
    }
});
class Point {
    static Points = [];
    static Active = null
    constructor(line, x, y, r = 20, c = "orangered") {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.line = line;
        Point.Points.push(this);
    }
    draw() {
        view.beginPath();
        view.fillStyle = this.color;
        view.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        view.fill();
    }
}

class Line {
    static Lines = [];
    constructor(x, y) {
        this.p1 = new Point(this, x - 100, y);
        this.p2 = new Point(this, x + 100, y);
        Line.Lines.push(this);
    }
    get Vector() { return subtractVector(this.p1, this.p2); }
    get UnitVector() { return normalizeVector(this.Vector); }
    get MidPoint() { return { x: (this.p1.x + this.p2.x) / 2, y: (this.p1.y + this.p2.y) / 2 }; }
    get Normal() {
        const uv = this.UnitVector;
        return { x: uv.y, y: -uv.x };
    }
    draw() {
        view.strokeStyle = "yellow";
        view.beginPath();
        const mp = this.MidPoint;
        view.moveTo(mp.x, mp.y);
        const n = this.Normal;
        //console.log(n);
        const ep = addVector(mp, multiplyVector(this.Normal, 40));
        view.lineTo(ep.x, ep.y);
        view.stroke();

        view.strokeStyle = "black";
        view.beginPath();
        view.moveTo(this.p1.x, this.p1.y);
        view.lineTo(this.p2.x, this.p2.y);
        view.stroke();

        this.p1.draw();
        this.p2.draw();
    }
}

const line1 = new Line(200, 200);

const line2 = new Line(300, 300);
const line3 = new Line(400, 400);

function animate() {
    view.clearRect(0, 0, canvas.width, canvas.height);
    for(const line of Line.Lines) line.draw();

    const dp = dot(line1.UnitVector, line2.UnitVector);
    view.fillStyle = "black";
    view.fillText(dp.toFixed(2), 20, 30);

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
