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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                </svg>
            </div>
            <div className="absolute right-0 h-full flex items-center text-gray-500 z-50">
                <svg
                    onClick={() => {
                        setPage((prev) => prev + 1);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
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
