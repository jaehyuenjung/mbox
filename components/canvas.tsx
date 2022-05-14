import { BaseProps } from "@components/layout";
import Rectangle from "@libs/client/canvas/shapes/rectangle";
import P5JsSettings from "@libs/client/canvas/utils/p5js_settings";
import type { NextPage } from "next";
import p5Types from "p5";
import { useEffect, useRef, useState } from "react";
import Sketch from "react-p5";
import {
    Engine,
    Mouse,
    MouseConstraint,
    World,
    Events,
    Bounds,
    Vector,
    Body,
} from "matter-js";
import Boundary from "@libs/client/canvas/shapes/boundary";
import React from "react";

// import decomp from "poly-decomp";
// window.decomp = decomp;

const DEFAULT_CATEGORY = 0x0001;
const RECTANGLE_CATEGORY = 0x0002;
const POINT_CATEGORY = 0x0003;
const PHOTO_CATEGORY = 0x0004;
const BOUNDARY_CATEGORY = 0x0005;

let albumImages: p5Types.Image[] = [];

const grounds: Boundary[] = [];
let shapes: Rectangle[] = [];
let img: p5Types.Image;
let engine: Matter.Engine;
let world: Matter.World;
let mConstraint: Matter.MouseConstraint;
let camera: p5Types.Camera;
let font: p5Types.Font;

const Canvas: NextPage = () => {
    const [photoURL, setPhotoURL] = useState<string[]>([
        "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg",
        "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__340.jpg",
        "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg",
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
    ]);
    const onClick = () => {
        if (P5) {
            const tump = "/assets/elephant-hd-quality.png";
            setPhotoURL((prev) => [...prev, tump]);
            albumImages.push(P5.loadImage(tump));
            const rectToDrag = new Rectangle(P5, 50, 50, 200, 200, world);
            rectToDrag.dragEnabled = true;
            rectToDrag.editEnabled = true;
            rectToDrag.fillColor = P5.color(80);
            shapes.push(rectToDrag);
        }
    };
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [P5, setP5] = useState<p5Types>();

    useEffect(() => {
        const setClientPageSize = () => {
            if (containerRef?.current) {
                const container = containerRef.current;
                setWidth(container.clientWidth);
                setHeight(container.clientHeight);
            }
        };
        setClientPageSize();

        window.addEventListener("resize", setClientPageSize);
        return () => {
            window.removeEventListener("resize", setClientPageSize);
        };
    }, []);

    const preload = (p5: p5Types) => {
        font = p5.loadFont("/assets/fonts/TMONBlack.ttf");
        albumImages = photoURL.map((url) => p5.loadImage(url));
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        setP5(p5);
        const canvas = p5
            .createCanvas(width, height, p5.WEBGL)
            .parent(canvasParentRef);
        engine = Engine.create();
        engine.gravity.y = 0;
        world = engine.world;
        P5JsSettings.init(p5);

        const mouse = Mouse.create(canvas.elt);
        mouse.pixelRatio = p5.pixelDensity();
        const options = {
            collisionFilter: {
                // mask: DEFAULT_CATEGORY,
            },
            mouse: mouse,
        };
        mConstraint = MouseConstraint.create(engine, options);
        World.add(world, mConstraint);

        grounds.push(new Boundary(-400 / 2, height / 2, 400, height, world));
        grounds.push(
            new Boundary(width + 400 / 2, height / 2, 400, height, world)
        );
        grounds.push(
            new Boundary(width / 2, -400 / 2, width + 400 * 2, 400, world)
        );
        grounds.push(
            new Boundary(
                width / 2,
                height + 400 / 2,
                width + 400 * 2,
                400,
                world
            )
        );

        shapes = albumImages.map(() => {
            const rectToDrag = new Rectangle(p5, 50, 50, 200, 200, world);
            rectToDrag.dragEnabled = true;
            rectToDrag.editEnabled = true;
            rectToDrag.fillColor = p5.color(80);
            return rectToDrag;
        });

        // Events.on(mConstraint, "mousemove", function (event) {
        //     const m = event.source.mouse;
        //     shapes.forEach((s) => {
        //         if (
        //             Bounds.contains(s.body.bounds, m.position) &&
        //             m.button == 0
        //         ) {
        //             const targetAngle = Vector.angle(
        //                 s.body.position,
        //                 m.position
        //             );
        //             Body.rotate(s.body, targetAngle - s.body.angle);
        //         }
        //     });
        // });

        // document.body.addEventListener("mousemove", function (event) {
        //     var mousePosition = { x: event.offsetX, y: event.offsetY };
        //     shapes.forEach((s) => {
        //         if (
        //             Bounds.contains(s.body.bounds, mousePosition) &&
        //             event.button === 0
        //         ) {
        //             const targetAngle = Vector.angle(
        //                 s.body.position,
        //                 mousePosition
        //             );
        //             Body.rotate(s.body, targetAngle - s.body.angle);
        //         }
        //     });
        // });

        p5.textureMode(p5.NORMAL);

        // camera = p5.createCamera();
        // camera.setPosition(0, 0, 600);
        // camera.lookAt(0, 0, 0);
        // p5.perspective(p5.PI / 3.0, width / height, 1, 1000);
    };
    const draw = (p5: p5Types) => {
        p5.background(0);
        Engine.update(engine);
        p5.translate(-width / 2, -height / 2);

        p5.noStroke();

        p5.push();
        grounds.forEach((g) => g.draw(p5));
        p5.pop();

        p5.push();
        shapes.forEach((s, i) => s.draw(p5, albumImages[i]));
        p5.pop();
    };

    return (
        <>
            <div
                ref={containerRef}
                className="relative w-screen h-screen overflow-hidden"
            >
                <Sketch
                    preload={preload}
                    setup={setup}
                    draw={draw}
                    windowResized={(p5) => {
                        p5.resizeCanvas(width, height);
                        // p5.perspective(p5.PI / 3.0, width / height, 1, 1000);
                    }}
                    mousePressed={(p5) => {
                        shapes
                            .filter((s) => s.dragEnabled)
                            .find((s) => s.handleMousePressed(p5));
                    }}
                    mouseDragged={(p5) => {
                        shapes
                            .filter((s) => s.isDragged)
                            .forEach((s) => s.handleMouseDragged(p5));
                    }}
                    mouseReleased={(p5) => {
                        shapes
                            .filter((s) => s.isDragged)
                            .forEach((s) =>
                                s.handleMouseReleased(p5, mConstraint)
                            );
                    }}
                />
            </div>
            <div
                onClick={onClick}
                className="fixed right-0 px-3 py-2 bg-green-300"
            >
                Add
            </div>
        </>
    );
};

export default React.memo(Canvas);
