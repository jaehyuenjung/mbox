import { BaseProps } from "@components/layout";
import Rectangle from "@libs/client/canvas/shapes/rectangle";
import type { NextPage } from "next";
import p5Types, { Image } from "p5";
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
import Canvas from "./canvas";
import { Photo } from "@prisma/client";
import useCanvasSize from "@libs/client/useCanvasSize";

interface EditCanvasProps {
    photo: Photo;
    url: string;
    onResize: (photoWidth: number, photoHeight: number) => void;
}

const EditCanvas: NextPage<EditCanvasProps> = ({ photo, url, onResize }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [engine, setEngine] = useState<Engine>();
    const [world, setWorld] = useState<World>();
    const { width, height } = useCanvasSize(containerRef);
    const [shape, setShape] = useState<Rectangle>();
    const [photoImage, setPhotoImage] = useState<Image>();
    const [P5, setP5] = useState<p5Types>();

    useEffect(() => {
        if (P5 && url) {
            setPhotoImage(P5.loadImage(url));
        }
    }, [P5, url]);

    const grounds: Boundary[] = [];
    let font: p5Types.Font;

    const preload = (p5: p5Types) => {
        font = p5.loadFont("/assets/fonts/TMONBlack.ttf");
        setPhotoImage(
            p5.loadImage(photo.imagePath ? photo.imagePath : "/noimage.jpg")
        );
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        setP5(p5);
        p5.createCanvas(width, height, p5.WEBGL).parent(canvasParentRef);

        const e = Engine.create();
        e.gravity.y = 0;
        const w = e.world;

        grounds.push(new Boundary(-400 / 2, height / 2, 400, height, w));
        grounds.push(new Boundary(width + 400 / 2, height / 2, 400, height, w));
        grounds.push(
            new Boundary(width / 2, -400 / 2, width + 400 * 2, 400, w)
        );
        grounds.push(
            new Boundary(width / 2, height + 400 / 2, width + 400 * 2, 400, w)
        );

        const rectToDrag = new Rectangle(
            p5,
            50,
            50,
            photo.width,
            photo.height,
            w
        );
        rectToDrag.dragEnabled = true;
        rectToDrag.editEnabled = true;
        rectToDrag.fillColor = p5.color(80);

        setShape(rectToDrag);

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
            if (shape && photoImage) {
                shape.draw(p5, photoImage);
            }
            p5.pop();
        }
    };

    return (
        <>
            <div
                ref={containerRef}
                className="absolute w-full h-full overflow-hidden"
            >
                <Canvas
                    preload={preload}
                    setup={setup}
                    draw={draw}
                    // windowResized={(p5) => {
                    //     p5.resizeCanvas(width, height, true);
                    //     // p5.perspective(p5.PI / 3.0, width / height, 1, 1000);
                    // }}
                    mousePressed={(p5) => {
                        if (shape && shape.dragEnabled) {
                            shape.handleMousePressed(p5);
                        }
                    }}
                    mouseDragged={(p5) => {
                        if (shape && shape.isDragged) {
                            shape.handleMouseDragged(p5);
                            onResize(shape._width, shape._height);
                        }
                    }}
                    mouseReleased={(p5) => {
                        if (shape && shape.isDragged) {
                            shape.handleMouseReleased(p5);
                        }
                    }}
                />
            </div>
        </>
    );
};

export default React.memo(EditCanvas);
