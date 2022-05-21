import { AnimatePresence, motion } from "framer-motion";
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
    Render,
} from "matter-js";
import Boundary from "@libs/client/canvas/shapes/boundary";
import React from "react";

let albumImages: p5Types.Image[] = [];

const grounds: Boundary[] = [];
let shapes: Rectangle[] = [];
let font: p5Types.Font;

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas: NextPage<CanvasProps> = ({ width, height }) => {
    const [photoURL, setPhotoURL] = useState<string[]>([
        "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg",
        "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__340.jpg",
        "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg",
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
    ]);
    const onClick = () => {
        if (P5 && world) {
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
    const [engine, setEngine] = useState<Engine>();
    const [world, setWorld] = useState<World>();
    const [P5, setP5] = useState<p5Types>();
    const [isHover, setIsHover] = useState(false);
    const [hoverX, setHoverX] = useState(-width);
    const [hoverY, setHoverY] = useState(-height);

    // useEffect(() => {
    //     if (P5) {
    //         P5.resizeCanvas(width, height);
    //     }
    // }, [P5, width, height, engine]);

    const preload = (p5: p5Types) => {
        font = p5.loadFont("/assets/fonts/TMONBlack.ttf");
        albumImages = photoURL.map((url) => p5.loadImage(url));
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        setP5(p5);
        const canvas = p5
            .createCanvas(width, height, p5.WEBGL)
            .parent(canvasParentRef);

        const e = Engine.create(canvas.elt);

        e.gravity.y = 0;
        const w = e.world;
        P5JsSettings.init(p5);

        grounds.push(new Boundary(-400 / 2, height / 2, 400, height, w));
        grounds.push(new Boundary(width + 400 / 2, height / 2, 400, height, w));
        grounds.push(
            new Boundary(width / 2, -400 / 2, width + 400 * 2, 400, w)
        );
        grounds.push(
            new Boundary(width / 2, height + 400 / 2, width + 400 * 2, 400, w)
        );

        shapes = albumImages.map(() => {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            const rectToDrag = new Rectangle(p5, x, y, 200, 200, w);
            rectToDrag.dragEnabled = true;
            rectToDrag.editEnabled = false;
            rectToDrag.fillColor = p5.color(80);
            return rectToDrag;
        });

        p5.textureMode(p5.NORMAL);

        setEngine(e);
        setWorld(w);
    };
    const draw = (p5: p5Types) => {
        if (engine) {
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
        }
    };

    const onCapture = () => {
        if (P5) {
            const canvas = document.getElementById(
                "defaultCanvas0"
            ) as HTMLCanvasElement;

            canvas.toBlob(async (blob) => {
                if (blob) {
                    console.log(URL.createObjectURL(blob));
                    // const { uploadURL } = await (
                    //     await fetch(`/api/files`)
                    // ).json();
                    // const formData = new FormData();
                    // formData.append("file", blob, "image.jpg");
                    // const {
                    //     result: { id },
                    // } = await (
                    //     await fetch(uploadURL, {
                    //         method: "POST",
                    //         body: formData,
                    //     })
                    // ).json();
                    // toDo: 앨범 표지 업로드
                }
            });
        }
    };

    return (
        <>
            {isHover && (
                <div
                    style={{
                        left: hoverX,
                        top: hoverY,
                    }}
                    className="absolute text-white text-lg z-50 px-3 py-2"
                >
                    hello
                </div>
            )}
            <div>
                <Sketch
                    preload={preload}
                    setup={setup}
                    draw={draw}
                    // windowResized={(p5) => {
                    //     p5.resizeCanvas(width, height, true);

                    //     // p5.perspective(p5.PI / 3.0, width / height, 1, 1000);
                    // }}
                    mousePressed={(p5) => {
                        shapes
                            .filter((s) => s.dragEnabled)
                            .find((s) => s.handleMousePressed(p5));
                    }}
                    mouseDragged={(p5) => {
                        setIsHover(false);
                        shapes
                            .filter((s) => s.isDragged)
                            .forEach((s) => s.handleMouseDragged(p5));
                    }}
                    mouseReleased={(p5) => {
                        shapes
                            .filter((s) => s.isDragged)
                            .forEach((s) => s.handleMouseReleased(p5));
                    }}
                    mouseMoved={(p5) => {
                        let flag = false;
                        shapes.forEach((s) => {
                            if (
                                Bounds.contains(s.body.bounds, {
                                    x: p5.mouseX,
                                    y: p5.mouseY,
                                })
                            ) {
                                if (!flag) flag = true;
                                if (!isHover) setIsHover(true);
                                setHoverX(p5.mouseX);
                                setHoverY(p5.mouseY);
                            }
                        });
                        if (!flag) setIsHover(false);
                    }}
                />
            </div>
        </>
    );
};

export default React.memo(Canvas);
