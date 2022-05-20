import { p5InstanceExtensions, Vector } from "p5";
import P5JsUtils from "../utils/p5js_utils";

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

    distTo(p5: p5InstanceExtensions, otherPoint: Point) {
        return p5.dist(this.x, this.y, otherPoint.x, otherPoint.y);
    }

    move(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    add(point: Vector) {
        this.x += point.x;
        this.y += point.y;
    }

    // static get ALIGN_MODE_MOVE_1() { return 0; }
    // static get ALIGN_MODE_MOVE_2() { return 1; }
    static get ALIGN_MODE_MOVE_3() {
        return 2;
    }
    static get ALIGN_MODE_AVERAGE() {
        return 3;
    }

    static align(
        p5: p5InstanceExtensions,
        p1: Vector,
        p2: Vector,
        p3: Vector,
        mode?: number
    ) {
        mode = mode ? mode : Point.ALIGN_MODE_MOVE_3;

        let vec12 = p5.createVector(p2.x - p1.x, p2.y - p1.y);
        let vec21 = p5.createVector(p1.x - p2.x, p1.y - p2.y);
        let vec23 = p5.createVector(p3.x - p2.x, p3.y - p2.y);

        let heading12 = vec12.heading();
        let heading23 = vec23.heading();

        // let angBtw = vec21.angleBetween(vec23);
        // console.log(`angBtw: ${angBtw}, heading diff: ${heading12 - heading23}`);

        switch (mode) {
            case Point.ALIGN_MODE_MOVE_3:
                vec23.rotate(heading12 - heading23);
                p3.x = p2.x + vec23.x;
                p3.y = p2.y + vec23.y;
                return;
            case Point.ALIGN_MODE_AVERAGE:
                let angleDiff = heading12 - heading23;
                //   vec23.rotate( );
                p3.x = p2.x + vec23.x;
                p3.y = p2.y + vec23.y;
                return;
        }
    }

    // NOTE: This function accepts alternate formatted params
    // (Point, heading)
    // (x, y, heading)
    rotateAbout(
        p5: p5InstanceExtensions,
        a: number | Point,
        b: number,
        c: number
    ) {
        let otherPoint;
        let heading;

        if (a instanceof Point) {
            otherPoint = a.pos;
            heading = b;
        } else {
            otherPoint = p5.createVector(a, b);
            heading = c;
        }

        let diff = Vector.sub(this.pos, otherPoint);
        diff.rotate(heading);
        this.x = otherPoint.x + diff.x;
        this.y = otherPoint.y + diff.y;
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
        if (this.dragEnabled) {
            P5JsUtils.drawControlPoints(p5, [this]);
        }
        p5.point(this.x, this.y);
    }
}

export default Point;
