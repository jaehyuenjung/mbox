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
    Render,
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
let font: p5Types.Font;

const Canvas2: NextPage = ({img,update_w_h}:any) => {
    const [photoURL, setPhotoURL] = useState<string[]>([
        img
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [engine, setEngine] = useState<Engine>();
    const [world, setWorld] = useState<World>();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [P5, setP5] = useState<p5Types>();
    const [isHover, setIsHover] = useState(false);
    const [hoverX, setHoverX] = useState(-100);
    const [hoverY, setHoverY] = useState(-100);

    useEffect(() => {
        if(P5 && img){
            albumImages[0] = P5.loadImage(img);
            
        }
    }, [img,P5])

    useEffect(() => {
        const setClientPageSize = () => {
            if (containerRef?.current) {
                const container = containerRef.current;
                setWidth(600);
                setHeight(400);
            }
        };
        setClientPageSize();

        // window.addEventListener("resize", setClientPageSize);
        return () => {
            // window.removeEventListener("resize", setClientPageSize);
        };
    }, []);

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

        const e = Engine.create();
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
            const rectToDrag = new Rectangle(p5, 50, 50, 200, 200, w);
            rectToDrag.dragEnabled = true;
            rectToDrag.editEnabled = true;
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
            <div
                ref={containerRef}
                className="relative w-auto h-auto overflow-hidden"
            >
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
                        shapes
                            .filter((s) => s.dragEnabled)
                            .find((s) => update_w_h(Math.round(s._width*100)/100,Math.round(s._height*100)/100));
                        
                       
                        
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

export default React.memo(Canvas2);
