import { NextPage } from "next";
import p5Types from "p5";
import Sketch from "react-p5";

interface CanvasProps {
    preload?: (p5: p5Types) => void;
    setup: (p5: p5Types, canvasParentRef: Element) => void;
    draw?: (p5: p5Types) => void;
    mousePressed?: (p5: p5Types) => void;
    mouseDragged?: (p5: p5Types) => void;
    mouseReleased?: (p5: p5Types) => void;
    mouseMoved?: (p5: p5Types) => void;
}

const Canvas: NextPage<CanvasProps> = ({
    preload,
    setup,
    draw,
    mousePressed,
    mouseDragged,
    mouseReleased,
    mouseMoved,
}) => {
    return (
        <Sketch
            preload={preload}
            setup={setup}
            draw={draw}
            mousePressed={mousePressed}
            mouseDragged={mouseDragged}
            mouseReleased={mouseReleased}
            mouseMoved={mouseMoved}
        />
    );
};

export default Canvas;
