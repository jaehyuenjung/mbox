import { Bodies, World } from "matter-js";
import { p5InstanceExtensions } from "p5";

class Boundary {
    w: number;
    h: number;
    body: Matter.Body;
    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        world: Matter.World
    ) {
        let options = {
            friction: 0.3,
            restitution: 0.6,
            isStatic: true,
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    draw(p5: p5InstanceExtensions) {
        let pos = this.body.position;
        let angle = this.body.angle;

        p5.push();
        p5.translate(pos.x, pos.y);
        p5.rotate(angle);
        p5.rectMode(p5.CENTER);
        p5.strokeWeight(1);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.rect(0, 0, this.w, this.h);
        p5.pop();
    }
}

export default Boundary;
