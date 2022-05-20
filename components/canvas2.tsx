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
import Tooltip from "./tooltip";
import SideMenu from "./sidemenu";

// import decomp from "poly-decomp";
// window.decomp = decomp;

const DEFAULT_CATEGORY = 0x0001;
const RECTANGLE_CATEGORY = 0x0002;
const POINT_CATEGORY = 0x0003;
const PHOTO_CATEGORY = 0x0004;
const BOUNDARY_CATEGORY = 0x0005;

const albumImages: p5Types.Image[] = [];
// const albumURLs = [
//     "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg",
// ];

const grounds: Boundary[] = [];
const shapes: Rectangle[] = [];
let img: p5Types.Image;
let engine: Matter.Engine;
let world: Matter.World;
let mConstraint: Matter.MouseConstraint;
let camera: p5Types.Camera;
let font: p5Types.Font;

const Canvas: NextPage = ({img}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [albumImages, setAlbumImages] = useState([]);
    // const [P5, setP5] = useState<p5Types>();
    // const [PhotoURL5, setPhotoURL] = useState([]);
    const [hovering, sethovering] = useState(false);
    const [toltipxy, settoltipxy] = useState([0,0]);
    const [p5_title, setp5_title] =useState('');
    const [p5_context, setp5_context] =useState('');
    const [albumURLs,setalbumURLs] = useState([img]);
    // const [imgsrc, setimgsrc]= useState('/noimage.jpg');
    // const [sidemenuopen, setsidemenuopen] = useState(false);
    console.log(img)
    useEffect(() => {
        const setClientPageSize = () => {
            if (containerRef?.current) {
                const container = containerRef.current;
                setWidth(500);
                setHeight(300);
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
        // img = p5.loadImage("/assets/elephant-hd-quality.png");
        albumURLs.forEach((url) => {
            albumImages.push(p5.loadImage(url));
        });
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
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

        albumImages.forEach(() => {
            const rectToDrag = new Rectangle(p5, 50, 50, 200, 200,'사진이에요','사진내용이에요', world);
            rectToDrag.dragEnabled = true;
            rectToDrag.editEnabled = true;
            rectToDrag.fillColor = p5.color(80);
            shapes.push(rectToDrag);
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
        //setP5(p5)
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

    // const btnsave = () => {

    // }
 
    // const imgload = (event:any) => {
    //     if(event.target.files[0]!=undefined){
    //         setimgsrc(URL.createObjectURL(event.target.files[0]))
    //     }
    // }

    // const titleupdate = (event: any) => {
    //     setp5_title(event.target.value)
    // }

    // const contextupdate = (event: any) => {
    //     setp5_context(event.target.value)
    // }

    // const menuclick = () =>{
    //     setsidemenuopen(!sidemenuopen)
    // }

    // const onClick = () => {
    //     if (P5) {
    //         setPhotoURL((prev) => [...prev, imgsrc]);
    //         albumImages.push(P5.loadImage(imgsrc));
    //         const rectToDrag = new Rectangle(P5, 150, 150, 200, 200,'사진제목입니다','사진내용입니다', world);
    //         rectToDrag.dragEnabled = true;
    //         rectToDrag.editEnabled = true;     
    //         rectToDrag.fillColor = P5.color(80);
    //         shapes.push(rectToDrag);
    //     }
    // };

    // const ondelete = () =>{

    // }

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
                    // p5.perspective(p5.PI / 3.0, width / height, 1, 1000);
                }}
                mousePressed={(p5) => {
                    shapes.filter((s) => s.dragEnabled).find((s) => s.handleMousePressed(p5))
                    shapes.forEach((s,i)=>{
                        if(Bounds.contains(s.body.bounds,{
                            x: p5.mouseX,
                            y: p5.mouseY,}) && !hovering
                        ){
                            setp5_title(s.title)
                            setp5_context(s.context)
                        }
                    })
                }}
                mouseDragged={(p5) => {
                    shapes.filter((s) => s.isDragged).forEach((s) => s.handleMouseDragged(p5));
                }}
                mouseReleased={(p5) => {
                    shapes.filter((s) => s.isDragged).forEach((s) => s.handleMouseReleased(p5, mConstraint));
                }}
                mouseMoved={(p5)=>{
                    shapes.forEach((s)=>{
                        if(Bounds.contains(s.body.bounds,{
                            x: p5.mouseX,
                            y: p5.mouseY,}))
                        {
                            //if(!sidemenuopen){
                                settoltipxy([p5.mouseX,p5.mouseY])
                                sethovering(true)
                                setp5_title(s.title)
                                setp5_context(s.context)
                            //}
                        }else if(!Bounds.contains(s.body.bounds,{
                            x: p5.mouseX,
                            y: p5.mouseY,}))
                        {   
                            sethovering(false)
                        }
                    })
                }}
            />
            {/* <button onClick={onClick} className={'fixed w-[55px] rounded-sm h-[30px] top-[5px] left-[5px] bg-slate-50'}>추가</button>
            <button onClick={ondelete} className={'fixed w-[55px] rounded-sm h-[30px] top-[5px] left-[65px] bg-slate-50'}>삭제</button> */}
            <Tooltip title={p5_title} context={p5_context} visible={hovering} x={toltipxy[0]}y={toltipxy[1]}/>
            {/* <SideMenu btnsave={btnsave} title={p5_title} context={p5_context} titleupdate={titleupdate}
             contextupdate={contextupdate} imgload={imgload} checked={false}
             inputclick={menuclick}/> */}
        </div>
    );
};

export default Canvas;
