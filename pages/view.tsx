import { AnimatePresence, useAnimation } from "framer-motion";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cls } from "@libs/client/utils";
import AnimationText from "@components/animation-text";

const albums = [
    { id: 1000, url: "/assets/elephant-hd-quality.png" },
    {
        id: 1001,
        url: "https://cdn.pixabay.com/photo/2017/06/04/23/17/lighthouse-2372461__340.jpg",
    },
    {
        id: 1002,
        url: "https://cdn.pixabay.com/photo/2016/09/29/13/08/planet-1702788__340.jpg",
    },
    {
        id: 1003,
        url: "https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252__340.jpg",
    },
    {
        id: 1004,
        url: "https://cdn.pixabay.com/photo/2018/09/19/23/03/sunset-3689760__340.jpg",
    },
    {
        id: 1005,
        url: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    },
    {
        id: 1006,
        url: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    },
    {
        id: 1007,
        url: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    },
];

const page = Math.min(albums.length - 1, 6);

const View: NextPage = () => {
    const [index, setIndex] = useState(0);
    const [delay, setDelay] = useState(false);

    const perAlbums = [];

    if (page) {
        for (let i = 0; i < page; i++) {
            perAlbums.push(albums[(index + i) % albums.length]);
        }
    }

    const onClick = () => {
        if (!delay) {
            setDelay(true);
            setIndex((prev) => (prev + 1) % albums.length);
        }
    };
    return (
        <div
            onClick={onClick}
            className="relative py-4 mx-auto w-screen max-w-6xl h-screen overflow-hidden bg-gray-800"
        >
            <div
                style={{ gridTemplateColumns: "2fr 1fr" }}
                className="h-full grid grid-cols items-center"
            >
                <div
                    style={{
                        perspective: "200px",
                        transformStyle: "preserve-3d",
                    }}
                    className="w-full h-full transform-gpu flex justify-end"
                >
                    <div
                        style={{
                            transformStyle: "preserve-3d",
                            transform: "rotateY(10deg) scaleY(1.2)",
                        }}
                        className="relative w-full h-full flex justify-center items-center top-[5%]"
                    >
                        <AnimatePresence
                            initial={false}
                            onExitComplete={() => {
                                setDelay(false);
                            }}
                        >
                            {perAlbums.map((album, i) => (
                                <motion.div
                                    key={album.id}
                                    exit={{
                                        opacity: 0,
                                        x: 200,
                                        z: 200,
                                    }}
                                    initial={{
                                        x: -i * 60,
                                        z: -i * 60,
                                    }}
                                    animate={{
                                        x: 60 - i * 60,
                                        z: 60 - i * 60,
                                    }}
                                    transition={{
                                        default: { duration: 1.5 },
                                        maskPosition: { duration: 5 },
                                        WebkitMaskPosition: { duration: 5 },
                                    }}
                                    className="absolute w-2/4 aspect-video"
                                >
                                    <div className="relative w-full h-full">
                                        <motion.div className="absolute w-full h-full bg-white opacity-80" />
                                        <motion.div
                                            style={{
                                                maskImage:
                                                    i == 0
                                                        ? "url(assets/sprites/slider-sprite.png)"
                                                        : "",
                                                WebkitMaskImage:
                                                    i == 0
                                                        ? "url(assets/sprites/slider-sprite.png)"
                                                        : "",
                                                maskSize: "3000% 100%",
                                                WebkitMaskSize: "3000% 100%",
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: i === 0 ? 1 : 0,
                                                transition: {
                                                    delay: 1,
                                                    duration: 1.5,
                                                },
                                            }}
                                            className={cls(
                                                "relative w-full h-full",
                                                i === 0 ? "slider" : ""
                                            )}
                                        >
                                            <Image
                                                src={album.url}
                                                layout="fill"
                                                alt=""
                                            />
                                        </motion.div>
                                    </div>
                                    <div className="relative w-full h-1/3 -bottom-[2%]">
                                        <motion.div
                                            animate={{
                                                opacity: i === 0 ? 0 : 0.8,
                                                transition: {
                                                    delay: 1,
                                                    duration: 1.2,
                                                },
                                            }}
                                            className="absolute w-full h-full bg-white"
                                        />
                                        <motion.div
                                            style={{
                                                maskImage:
                                                    i == 0
                                                        ? "url(assets/sprites/slider-sprite.png)"
                                                        : "",
                                                WebkitMaskImage:
                                                    i == 0
                                                        ? "url(assets/sprites/slider-sprite.png)"
                                                        : "",

                                                maskSize: "3000% 100%",
                                                WebkitMaskSize: "3000% 100%",
                                                transform: "rotateX(180deg)",
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: i === 0 ? 1 : 0,
                                                transition: {
                                                    delay: 1,
                                                    duration: 1.5,
                                                },
                                            }}
                                            className={cls(
                                                "relative w-full h-full",
                                                i === 0 ? "slider" : ""
                                            )}
                                        >
                                            <Image
                                                src={album.url}
                                                layout="fill"
                                                alt=""
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div>
                    <AnimationText
                        key={index}
                        staggerTime={0.1}
                        text="This is Album"
                        kind="fading"
                        afterColor="white"
                        beforeColor="white"
                    />
                </div>
            </div>
        </div>
    );
};

export default View;
