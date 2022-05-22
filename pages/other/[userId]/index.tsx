import { AnimatePresence, MotionConfig } from "framer-motion";
import {
    GetStaticPaths,
    GetStaticProps,
    NextPage,
    NextPageContext,
} from "next";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { cls } from "@libs/client/utils";
import AnimationText from "@components/animation-text";
import Link from "next/link";
import Modal from "@components/modal";
import useSWR, { SWRConfig } from "swr";
import client from "libs/server/client";
import { getSession } from "next-auth/react";
import { Album } from "@prisma/client";
import { ResponseType } from "@libs/server/withHandler";

interface IAlbum {
    id: number;
    title: string;
    url: string;
}

interface IPerAlbum extends Album {
    key: number;
}

const infoWrapperVariants = {
    visible: {
        transition: { staggerChildren: 0.2, delayChildren: 2 },
    },
};

const infoColVariants = {
    hidden: {
        y: 30,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
    },
};

interface HomeProps {
    albums: Album[];
}

const Home: NextPage<HomeProps> = ({ albums }) => {
    const [index, setIndex] = useState(0);
    const [perIndex, setPerIndex] = useState(0);
    const [delay, setDelay] = useState(false);

    const page = Math.min(albums.length - 1, 6);
    const perAlbums: IPerAlbum[] = [];

    if (page) {
        for (let i = 0; i < page; i++) {
            perAlbums.push({
                ...albums[(index + i) % albums.length],
                key: (perIndex + i) % (page * 2 + 1),
            });
        }
    } else {
        perAlbums.push({
            ...albums[0],
            key: 0,
        });
    }

    return (
        <div
            // onClick={onClick}
            className="relative py-4 mx-auto w-full max-w-6xl h-full overflow-hidden bg-gray-800"
        >
            <div
                style={{ gridTemplateColumns: "2fr 1fr" }}
                className="h-full grid grid-cols items-center mr-16"
            >
                <div
                    style={{
                        perspective: "250px",
                        transformStyle: "preserve-3d",
                    }}
                    className="w-full h-full transform-gpu flex justify-end"
                >
                    <div
                        style={{
                            transformStyle: "preserve-3d",
                            transform: "rotateY(10deg) scaleY(1.2)",
                        }}
                        className="relative w-full h-full flex justify-center items-center"
                    >
                        <AnimatePresence
                            onExitComplete={() => {
                                setDelay(false);
                            }}
                        >
                            {perAlbums.map((album, i) => (
                                <motion.div
                                    key={album.key}
                                    exit={{
                                        opacity: 0,
                                        x: 200,
                                        z: 200,
                                    }}
                                    initial={{
                                        x: -i * 60,
                                        z: -i * 60,
                                        filter: `blur(${i * 0.5}px)`,
                                    }}
                                    animate={{
                                        x: 60 - i * 60,
                                        z: 60 - i * 60,
                                        filter: `blur(${i * 0.5}px)`,
                                    }}
                                    transition={{
                                        default: { duration: 1.5 }, // 1.5
                                    }}
                                    className="absolute w-2/4 aspect-video"
                                >
                                    <div className="relative w-full h-full">
                                        <motion.div className="absolute w-full h-full bg-white rounded-md" />
                                        <motion.div
                                            style={{
                                                maskImage:
                                                    i == 0
                                                        ? "url(/assets/sprites/slider-sprite.png)"
                                                        : "",
                                                WebkitMaskImage:
                                                    i == 0
                                                        ? "url(/assets/sprites/slider-sprite.png)"
                                                        : "",
                                                maskSize: "3000% 100%",
                                                WebkitMaskSize: "3000% 100%",
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: i === 0 ? 1 : 0,
                                                transition: {
                                                    delay: 1,
                                                    duration: 1.5, // 1.5,
                                                },
                                            }}
                                            className={cls(
                                                "relative w-full h-full rounded-md",
                                                i === 0 ? "slider" : ""
                                            )}
                                        >
                                            {album.imagePath ? (
                                                <Image
                                                    src={album.imagePath}
                                                    layout="fill"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="h-full  bg-gray-300" />
                                            )}
                                        </motion.div>
                                    </div>
                                    <div className="absolute w-full h-1/2 top-[102%] overflow-hidden">
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{
                                                opacity: i === 0 ? 0 : 1,
                                                transition: { duration: 2 },
                                            }}
                                            style={{
                                                background:
                                                    "linear-gradient(to bottom, rgba(255,255,255,0.2) 1%, rgba(31, 41, 55, 1) 40%, rgba(31, 41, 55, 1) 100%)",
                                            }}
                                            className="absolute w-full h-[200%] rounded-md"
                                        />
                                        <motion.div
                                            style={{
                                                maskImage:
                                                    i == 0
                                                        ? "url(/assets/sprites/slider-sprite.png)"
                                                        : "",
                                                WebkitMaskImage:
                                                    i == 0
                                                        ? "url(/assets/sprites/slider-sprite.png)"
                                                        : "",

                                                maskSize: "3000% 100%",
                                                WebkitMaskSize: "3000% 100%",
                                                transform: "rotateX(180deg)",
                                                backgroundImage: `url(${
                                                    album.imagePath
                                                        ? album.imagePath
                                                        : null
                                                })`,
                                                backgroundSize: "100% 100%",
                                            }}
                                            initial={{
                                                opacity: 0,
                                            }}
                                            animate={{
                                                opacity: i === 0 ? 0.5 : 0,

                                                transition: {
                                                    delay: 1,
                                                    duration: 1.5,
                                                },
                                            }}
                                            className={cls(
                                                "relative w-full bg-center bg-no-repeat bg-cover h-[200%] rounded-md",
                                                i === 0 ? "slider" : ""
                                            )}
                                        >
                                            <div
                                                style={{
                                                    background:
                                                        "linear-gradient(to top, transparent 1%, rgba(31, 41, 55, 1) 40%, rgba(31, 41, 55, 1) 100%) ",
                                                }}
                                                className="w-full h-full"
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {albums.length && (
                    <div key={index}>
                        <div>
                            <div className="w-full flex justify-between items-center">
                                <h2 className="text-2xl font-bold">
                                    <AnimationText
                                        staggerTime={0.1}
                                        text={albums[index].title}
                                        kind="fading"
                                        className="text-white"
                                    />
                                </h2>
                            </div>
                            <AnimatePresence>
                                <motion.div
                                    className="w-full space-y-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={infoWrapperVariants}
                                >
                                    <MotionConfig
                                        transition={{
                                            default: {
                                                ease: "easeInOut",
                                                duration: 0.5,
                                            },
                                        }}
                                    >
                                        <motion.div
                                            className="w-full flex space-x-2 text-gray-500"
                                            variants={infoColVariants}
                                        >
                                            <div className="whitespace-nowrap">
                                                {new Date().toDateString()}
                                            </div>
                                            <span>/</span>
                                            <div>#태그 #태그 #태그</div>
                                        </motion.div>

                                        <motion.textarea
                                            readOnly
                                            className="w-full h-36 text-white bg-transparent resize-none overflow-hidden focus:overflow-auto focus:outline-none"
                                            variants={infoColVariants}
                                            value={
                                                albums[index].description + ""
                                            }
                                        ></motion.textarea>
                                    </MotionConfig>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div>
                            {/* 해당 앨범 내부로 들어가는 버튼 */}
                            <Link href="/">
                                <button> hello</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <motion.div
                className="absolute bottom-0"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 1.2 }}
            >
                <ul className="flex justify-between space-x-4 py-2 mx-4">
                    {albums.map((album, i) => (
                        <li
                            key={i}
                            className="relative text-white"
                            onClick={() => {
                                if (!delay) {
                                    const gap =
                                        (albums.length - (index - i)) %
                                        albums.length;
                                    setIndex(i);
                                    if (gap <= 6)
                                        setPerIndex(
                                            (prev) =>
                                                (prev + gap) % (page * 2 + 1)
                                        );
                                    else
                                        setPerIndex(
                                            (prev) =>
                                                (prev + 6) % (page * 2 + 1)
                                        );
                                    setDelay(true);
                                }
                            }}
                        >
                            <h4>{album.title}</h4>
                            {i == index && (
                                <motion.div
                                    layoutId={"underline"}
                                    className="w-full h-1 absolute -bottom-[2px] bg-red-400 rounded-md"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    if (!ctx.params?.userId) {
        return {
            notFound: true,
        };
    }

    const isExist = await client.user.findUnique({
        where: { id: String(ctx.params.userId) },
    });

    if (!isExist) {
        return {
            notFound: true,
        };
    }

    const albums = await client.album.findMany({
        where: {
            user: isExist,
        },
    });

    return {
        props: {
            albums: JSON.parse(JSON.stringify(albums)),
        },
        revalidate: 60,
    };
};

export default Home;
