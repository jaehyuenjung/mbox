import { BaseProps } from "@components/layout";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Canvas = dynamic(() => import("@components/canvas"), { ssr: false });

const Map: NextPage<BaseProps> = ({}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const setClientPageSize = () => {
            if (containerRef?.current) {
                const container = containerRef.current;
                setWidth(container.clientWidth);
                setHeight(container.clientHeight);
            }
        };
        setClientPageSize();

        // window.addEventListener("resize", setClientPageSize);
        return () => {
            // window.removeEventListener("resize", setClientPageSize);
        };
    }, []);

    return (
        <div className="bg-black">
            <div className="absolute left-0 h-full flex items-center text-gray-500 z-50">
                <div>Left</div>
            </div>
            <div className="absolute right-0 h-full flex items-center text-gray-500 z-50">
                <div
                    onClick={() => {
                        setPage((prev) => prev + 1);
                    }}
                >
                    Right
                </div>
            </div>
            <div className="absolute left-0 top-[95%] w-full flex justify-center items-end text-gray-500 z-[1] space-x-2 select-none">
                <span>{page}</span>
                <span>/</span>
                <span>1</span>
            </div>
            <AnimatePresence initial={false} exitBeforeEnter>
                <motion.div
                    key={page}
                    initial={{ x: width }}
                    animate={{
                        x: 0,
                    }}
                    exit={{
                        x: -width,
                    }}
                    transition={{
                        duration: 0.8,
                        type: "tween",
                    }}
                    ref={containerRef}
                    className="relative w-screen h-screen overflow-hidden"
                >
                    <Canvas key={page} width={width} height={height} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Map;
