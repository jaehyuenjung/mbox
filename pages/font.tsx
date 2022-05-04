import { BaseProps } from "@components/layout";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import p5Types from "p5";
import { useEffect, useRef, useState } from "react";

const Sketch = dynamic(() => import("react-p5"), {
    ssr: false,
});

const albumURLs = [
    "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg",
    "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__340.jpg",
    "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg",
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
    // "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2018/09/23/18/30/drop-3698073_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2018/08/21/23/29/forest-3622519_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2014/09/14/18/04/dandelion-445228_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2018/01/30/22/50/forest-3119826_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2017/12/15/13/51/polynesia-3021072_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    // "https://cdn.pixabay.com/photo/2013/10/02/23/03/mountains-190055__340.jpg",
    // "https://cdn.pixabay.com/photo/2018/09/19/23/03/sunset-3689760__340.jpg",
    // "https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252__340.jpg",
    // "https://cdn.pixabay.com/photo/2016/09/29/13/08/planet-1702788__340.jpg",
    "https://cdn.pixabay.com/photo/2017/06/04/23/17/lighthouse-2372461__340.jpg",
    "/assets/elephant-hd-quality.png",
];

const albumImages: p5Types.Image[] = [];

let camera: p5Types.Camera;
let font: p5Types.Font;
let x = 0;
let z = 0;
let loading = true;
let progress = 0;
let hover = false;
let start = 0;
let animating = false;
let end = 0;
let ss = 0;
let ee = 0;
let slider = false;

const Font: NextPage<BaseProps> = ({}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

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
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(width, height, p5.WEBGL).parent(canvasParentRef);

        camera = p5.createCamera();
        camera.setPosition(0, 0, 100);
        camera.lookAt(0, 0, 0);
        p5.perspective(p5.PI / 3.0, width / height, 1, 1000);

        const promises = albumURLs.map(
            (url) =>
                new Promise((resolve, reject) => {
                    albumImages.push(
                        p5.loadImage(url, (image) => {
                            progress += 100 / albumImages.length;
                            resolve(null);
                        })
                    );
                })
        );

        Promise.all(promises).then(() => {
            loading = false;
        });

        ss = Date.now();
        ee = ss + 3000;
    };
    const draw = (p5: p5Types) => {
        const now = Date.now();
        p5.background(0);

        if (!loading) {
            // to 15
            if (ee > now) {
                const total = ee - ss;
                const value = ee - now;
                const t = Math.floor((value / total) * 100) / 100;
                const initX = -5 * albumURLs.length - 5;
                const initZ = -30 * albumURLs.length + 30;
                x =
                    Math.pow(1 - t, 2) * initX +
                    2 * (1 - t) * t * (initX - 1) +
                    t * t * (initX - 160);
                z =
                    Math.pow(1 - t, 2) * initZ +
                    2 * (1 - t) * t * (initZ - 10) +
                    t * t * (initZ - 1000);
            }
            p5.push();
            p5.textureMode(p5.IMAGE);
            p5.rotateY(p5.radians(25));
            p5.smooth();
            p5.noStroke();
            p5.translate(x, 0, z);
            const rectToDrag = p5.rect(50, 50, 200, 200);

            albumImages.forEach((image, index) => {
                if (index === albumURLs.length - 1 && !hover) {
                    if (end > now && animating) {
                        const total = end - start;
                        const value = end - now;
                        // 0 ~ -25
                        const t = Math.floor((value / total) * 100) / 100;
                        p5.rotateY(
                            p5.radians(
                                Math.pow(1 - t, 2) * 0 +
                                    2 * (1 - t) * t * -2 +
                                    t * t * -25
                            )
                        );
                    } else {
                        if (animating) animating = false;
                    }
                } else if (index === albumURLs.length - 1 && hover) {
                    if (end > now && animating) {
                        // -25 ~ 0
                        const total = end - start;
                        const value = end - now;
                        const t = Math.floor((value / total) * 100) / 100;
                        p5.rotateY(
                            p5.radians(
                                Math.pow(1 - t, 2) * -25 +
                                    2 * (1 - t) * t * -23 +
                                    t * t * 0
                            )
                        );
                    } else {
                        if (animating) animating = false;
                        p5.rotateY(p5.radians(-25));
                    }
                }
                p5.translate(5, 0, 30);

                p5.push();
                p5.texture(image);
                p5.plane(60, 40);
                p5.pop();

                p5.push();
                p5.rotateX(p5.radians(180));
                p5.translate(0, -28, 0);
                p5.directionalLight(204, 204, 204, 0, -1, 10);
                p5.texture(image);
                p5.plane(60, 15);
                p5.pop();
            });
            p5.pop();
        } else {
            p5.textFont(font);
            p5.textAlign(p5.CENTER, p5.CENTER);

            p5.text("Loading" + ".".repeat((p5.millis() / 500) % 4), 0, -15);
            p5.push();
            p5.rectMode(p5.CENTER);
            p5.rect(0, 0, 100, 5);
            p5.pop();

            p5.push();
            p5.noStroke();
            p5.fill(100, 100, 100);
            p5.rect(-50, -2.5, progress, 5);
            p5.pop();

            p5.push();
            p5.noStroke();
            p5.fill(0, 0, 0);
            p5.textSize(3);
            p5.text(Math.min(Math.round(progress), 100) + "%", 0, 0);
            p5.pop();
        }
    };

    return (
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
                    p5.perspective(p5.PI / 3.0, width / height, 1, 1000);
                }}
                mouseMoved={(p5) => {
                    const now = Date.now();
                    const x = p5.mouseX - width / 2;
                    const y = p5.mouseY - height / 2;

                    if (
                        hover &&
                        !(260 > x && -340 < x && 200 > y && -200 < y) &&
                        !animating &&
                        !slider
                    ) {
                        animating = true;
                        hover = false;
                        start = now;
                        end = now + 800;
                    } else if (
                        !hover &&
                        260 > x &&
                        -340 < x &&
                        200 > y &&
                        -200 < y &&
                        !animating &&
                        !slider
                    ) {
                        animating = true;
                        hover = true;
                        start = now;
                        end = now + 800;
                    }
                }}
            />
        </div>
    );
};

export default Font;
