console.log("working");
const canvas = document.querySelector("canvas");
const view = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
view.lineWidth = 10;

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
}

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
    draw() {
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

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
