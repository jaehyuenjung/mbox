import { p5InstanceExtensions, Vector } from "p5";

class Point {
    pos: Vector;
    radius: number;
    isBeingDragged: boolean;
    dragEnabled: boolean;
    isDragged: boolean;
    constructor(p5: p5InstanceExtensions, x: number, y: number) {
        this.pos = p5.createVector(x, y);
        this.radius = 10;
        this.isBeingDragged = false;
        this.dragEnabled = false;
        this.isDragged = false;
    }

    get x() {
        return this.pos.x;
    }
    get y() {
        return this.pos.y;
    }
    set x(newVal) {
        this.pos.x = newVal;
    }
    set y(newVal) {
        this.pos.y = newVal;
    }

    set(x: number, y: number) {
        this.pos.x = x;
        this.pos.y = y;
    }

    move(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    add(point: Vector) {
        this.x += point.x;
        this.y += point.y;
    }

    containsXY(p5: p5InstanceExtensions, x: number, y: number) {
        return p5.dist(x, y, this.x, this.y) < this.radius;
    }

    handleMousePressed(p5: p5InstanceExtensions) {
        this.isDragged = this.containsXY(p5, p5.mouseX, p5.mouseY);
        return this.isDragged;
    }

    handleMouseDragged(p5: p5InstanceExtensions) {
        this.set(p5.mouseX, p5.mouseY);
    }

    handleMouseReleased() {
        this.isDragged = false;
    }

    draw(p5: p5InstanceExtensions) {
        if (this.containsXY(p5, p5.mouseX, p5.mouseY)) {
            p5.fill(200, 200, 100);
        } else {
            p5.fill(100, 200, 100);
        }
        p5.noStroke();
        p5.ellipse(this.x, this.y, this.radius, this.radius);
    }
}

export default Point;
