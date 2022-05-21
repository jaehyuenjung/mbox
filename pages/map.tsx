import { BaseProps } from "@components/layout";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";

const Canvas = dynamic(() => import("@components/canvas"), { ssr: false });

interface IForm {
    no: number;
}

const Map: NextPage<BaseProps> = ({}) => {
    const { register, handleSubmit } = useForm<IForm>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [back, setBack] = useState(false);
    const [delay, setDelay] = useState(false);
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

    const pageMove = (no: number) => {
        if (page < no) {
            const promise = new Promise((resolve, reject) => {
                setBack(false);
                resolve(null);
            });

            promise.then(() => setPage(no));
        } else if (page > no) {
            const promise = new Promise((resolve, reject) => {
                setBack(true);
                resolve(null);
            });

            promise.then(() => setPage(no));
        }
    };

    const onValid = ({ no }: IForm) => {
        if (no) {
            pageMove(no);
        }
    };

    return (
        <div className="bg-black">
            <div className="absolute left-0 h-full flex items-center text-gray-500 z-50">
                <svg
                    onClick={() => {
                        if (!delay) {
                            pageMove(page - 1);
                            setDelay(true);
                        }
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 cursor-pointer hover:text-gray-300"
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
                        if (!delay) {
                            pageMove(page + 1);
                            setDelay(true);
                        }
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 cursor-pointer hover:text-gray-300"
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
            <div className="absolute left-0 top-[95%] w-full text-gray-500 z-50 select-none">
                <div className="relative flex justify-center items-end space-x-2 text-white">
                    <span>{page}</span>
                    <span>/</span>
                    <span>1</span>
                    <div className="absolute flex right-4 space-x-4 text-white">
                        <span>Go to</span>
                        <form onSubmit={handleSubmit(onValid)}>
                            <input
                                {...register("no")}
                                type="number"
                                className="w-12 text-black"
                            />
                        </form>
                    </div>
                </div>
            </div>
            <AnimatePresence
                initial={false}
                exitBeforeEnter
                onExitComplete={() => setDelay(false)}
            >
                <motion.div
                    key={page}
                    initial={{ x: back ? width : -width }}
                    animate={{
                        x: 0,
                    }}
                    exit={{
                        x: back ? -width : width,
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
