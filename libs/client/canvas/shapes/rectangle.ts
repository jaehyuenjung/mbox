import { Color, p5InstanceExtensions } from "p5";
import Rect from "../models/rect";
import P5JsUtils from "../utils/p5js_utils";
import Point from "./point";
import Matter, {
    World,
    Bodies,
    Vertices,
    Body,
    Constraint,
    Bounds,
    Vector,
} from "matter-js";
import p5Types from "p5";
import { Album } from "@prisma/client";
import { throws } from "assert";

const DEFAULT_CATEGORY = 0x0001;
const RECTANGLE_CATEGORY = 0x0002;
const POINT_CATEGORY = 0x0003;

class Rectangle extends Rect {
    body: Matter.Body;
    dragEnabled: boolean;
    editEnabled: boolean;
    dragArea: Rectangle;
    dragOffset?: Point;
    isDragged: boolean;
    fillColor: Color;
    topLeft!: Point;
    topRight!: Point;
    bottomRight!: Point;
    bottomLeft!: Point;
    points: Point[] = [];
    velocity: Vector;
    constructor(
        p5: p5InstanceExtensions,
        x: number,
        y: number,
        p_nWidth: number,
        p_nHeight: number,
        world: Matter.World
    ) {
        super(x, y, p_nWidth, p_nHeight);
        this.initPoints(p5);
        this.computePoints();

        const options = {
            collisionFilter: {
                category: RECTANGLE_CATEGORY,
            },
            friction: 0.3,
            restitution: 0.6,
        };
        const vertices = [
            [
                { x: this.topLeft.x, y: this.topLeft.y },
                { x: this.bottomLeft.x, y: this.bottomLeft.y },
                { x: this.centerX, y: this.centerY },
                { x: this.bottomRight.x, y: this.bottomRight.y },
                { x: this.topRight.x, y: this.topRight.y },
            ],
        ];
        this.body = Bodies.fromVertices(
            x + p_nWidth / 2,
            y + p_nHeight / 2,
            vertices,
            options
        );

        Body.setInertia(this.body, Infinity);

        this.dragEnabled = false;
        this.editEnabled = false;
        this.dragArea = this;
        this.dragOffset = undefined;
        this.isDragged = false;
        this.fillColor = p5.color(80);
        World.add(world, this.body);
        this.velocity = { x: 0, y: 0 };
    }

    setSize(newSize: number) {
        let deltaWidth = this.width - newSize;
        let deltaHeight = this.height - newSize;

        // Maintain location
        this._x += deltaWidth / 2;
        this._y += deltaHeight / 2;

        this._width = newSize;
        this._height = newSize;
    }

    initPoints(p5: p5InstanceExtensions) {
        this.topLeft = new Point(p5, 0, 0);
        this.topRight = new Point(p5, 0, 0);
        this.bottomRight = new Point(p5, 0, 0);
        this.bottomLeft = new Point(p5, 0, 0);

        this.points.push(this.topLeft);
        this.points.push(this.topRight);
        this.points.push(this.bottomRight);
        this.points.push(this.bottomLeft);
    }

    computePoints() {
        this.topLeft.set(this.minX, this.minY);
        this.topRight.set(this.maxX, this.minY);
        this.bottomRight.set(this.maxX, this.maxY);
        this.bottomLeft.set(this.minX, this.maxY);
    }

    handleMousePressed(p5: p5InstanceExtensions) {
        const pointPressed = this.points.find((p) =>
            p.containsXY(p5, p5.mouseX, p5.mouseY)
        );

        if (pointPressed && this.editEnabled) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else {
            const dragAreaPressed = Bounds.contains(this.body.bounds, {
                x: p5.mouseX,
                y: p5.mouseY,
            });

            if (dragAreaPressed) {
                this.isDragged = true;
                this.dragOffset = new Point(
                    p5,
                    p5.mouseX - this.body.position.x,
                    p5.mouseY - this.body.position.y
                );

                if (this.body.velocity.x || this.body.velocity.y) {
                    Body.setVelocity(this.body, { x: 0, y: 0 });
                }
                return true;
            }
        }
        return false;
    }

    handleMouseDragged(p5: p5InstanceExtensions) {
        const pointDragged = this.points.find((p) => p.isBeingDragged);

        if (pointDragged) {
            // const originPos = { x: pointDragged.x, y: pointDragged.y };
            // const pos = this.body.position;
            pointDragged.set(p5.mouseX, p5.mouseY);

            if (this.topLeft == pointDragged) {
                this.bottomLeft.x = pointDragged.x;
                this.topRight.y = pointDragged.y;
            } else if (this.topRight == pointDragged) {
                this.bottomRight.x = pointDragged.x;
                this.topLeft.y = pointDragged.y;
            } else if (this.bottomRight == pointDragged) {
                this.topRight.x = pointDragged.x;
                this.bottomLeft.y = pointDragged.y;
            } else if (this.bottomLeft == pointDragged) {
                this.topLeft.x = pointDragged.x;
                this.bottomRight.y = pointDragged.y;
            }

            const vertices = [
                this.bottomRight,
                this.bottomLeft,
                this.topLeft,
                this.topRight,
            ];

            this._width = Math.abs(this.topRight.x-this.topLeft.x);
            this._height = Math.abs(this.topRight.y - this.bottomRight.y);

            Body.setCentre(this.body, Vertices.centre(vertices));
            Body.setVertices(
                this.body,
                Vertices.create(
                    [
                        this.bottomRight,
                        this.bottomLeft,
                        this.topLeft,
                        this.topRight,
                    ],
                    this.body
                )
            );
            Body.setInertia(this.body, Infinity);
        } else {
            this._x = p5.mouseX - this.dragOffset!.x;
            this._y = p5.mouseY - this.dragOffset!.y;

            this.velocity.x = this._x - this.body.position.x;
            this.velocity.y = this._y - this.body.position.y;
            Body.setPosition(this.body, { x: this._x, y: this._y });
        }
    }

    handleMouseReleased(p5: p5InstanceExtensions) {
        this.points.forEach((p) => {
            p.isBeingDragged = false;
        });
        this.isDragged = false;

        Body.setVelocity(this.body, this.velocity);
        this.velocity.x = this.velocity.y = 0;
    }

    draw(p5: p5InstanceExtensions, img: p5Types.Image) {
        let vertices = [...this.body.vertices];
        this.bottomRight.set(vertices[0].x, vertices[0].y);
        this.bottomLeft.set(vertices[1].x, vertices[1].y);
        this.topLeft.set(vertices[2].x, vertices[2].y);
        this.topRight.set(vertices[3].x, vertices[3].y);

        p5.push();
        P5JsUtils.applyStyleSet(p5, this);
        p5.push();
        p5.noStroke();
        p5.smooth();
        p5.texture(img);
        p5.beginShape();
        p5.vertex(this.topLeft.x, this.topLeft.y, 0, 0);
        p5.vertex(this.topRight.x, this.topRight.y, 1, 0);
        p5.vertex(this.bottomRight.x, this.bottomRight.y, 1, 1);
        p5.vertex(this.bottomLeft.x, this.bottomLeft.y, 0, 1);
        p5.endShape();
        p5.pop();
        if (this.dragEnabled && this.editEnabled) {
            P5JsUtils.drawControlPoints(p5, this.points);
        }
        p5.pop();
    }
}

export default Rectangle;
