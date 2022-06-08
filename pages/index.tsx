import { AnimatePresence, MotionConfig } from "framer-motion";
import { NextPage, NextPageContext } from "next";
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
import { BaseProps } from "@components/layout";
import { ResponseType } from "@libs/server/withHandler";
import AlbumForm from "@components/album-form";
import Dialog from "@components/dialog";
import { QRCodeCanvas } from "qrcode.react";

// 1: Create, 2: Update 3: QR
type MODAL_CONTENT_TYPE = 1 | 2 | 3;

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

interface AlbumListResponse extends ResponseType {
    albums: Album[];
}

interface DialogBtn {
    text: string;
    onCallback: () => void;
}

const Home: NextPage<BaseProps> = ({ user }) => {
    const { data, mutate } = useSWR<AlbumListResponse>("/api/albums/me");

    const [index, setIndex] = useState(0);
    const [perIndex, setPerIndex] = useState(0);
    const [delay, setDelay] = useState(false);
    const [selectPerIndex, setSelectPerIndex] = useState<Album>();

    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContentType, setModalContentType] =
        useState<MODAL_CONTENT_TYPE>();

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");
    const [dialogButtons, setDialogButtons] = useState<DialogBtn[]>([]);

    const albums = data?.albums ? data.albums : [];

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
        <div className="relative py-4 mx-auto w-full max-w-6xl h-full overflow-hidden bg-gray-800">
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
                                            <Image
                                                src={album.imagePath!}
                                                layout="fill"
                                                alt=""
                                            />
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
                                                backgroundImage: `url(${album.imagePath})`,
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

                <div key={index}>
                    {albums[index] && (
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

                                <motion.div
                                    variants={infoColVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 3 }}
                                    onClick={() => {
                                        setOpenDialog(true);
                                        setDialogTitle("");
                                        setDialogContent("");
                                        setDialogButtons([
                                            {
                                                text: "qr코드/url 복사",
                                                onCallback: () => {
                                                    setOpenModal(true);
                                                    setModalTitle("");
                                                    setModalContentType(3);
                                                },
                                            },
                                            {
                                                text: "수정",
                                                onCallback: () => {
                                                    setOpenModal(true);
                                                    setModalTitle("앨범 수정");
                                                    setModalContentType(2);
                                                },
                                            },
                                            {
                                                text: "삭제",
                                                onCallback: () => {
                                                    if (data) {
                                                        fetch(
                                                            `/api/albums/me/${albums[index].id}`,
                                                            {
                                                                method: "DELETE",
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                            }
                                                        );

                                                        const newAlbum = [
                                                            ...data.albums.slice(
                                                                0,
                                                                index
                                                            ),
                                                            ...data.albums.slice(
                                                                index + 1
                                                            ),
                                                        ];
                                                        mutate(
                                                            {
                                                                ok: true,
                                                                albums: newAlbum,
                                                            },
                                                            false
                                                        );
                                                        setOpenDialog(false);
                                                    }
                                                },
                                            },
                                            {
                                                text: "취소",
                                                onCallback: () =>
                                                    setOpenDialog(false),
                                            },
                                        ]);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <div>
                                        <svg
                                            aria-label="옵션 더 보기"
                                            className="_8-yf5 "
                                            color="#fff"
                                            fill="#fff"
                                            height="24"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="1.5"
                                            ></circle>
                                            <circle
                                                cx="6"
                                                cy="12"
                                                r="1.5"
                                            ></circle>
                                            <circle
                                                cx="18"
                                                cy="12"
                                                r="1.5"
                                            ></circle>
                                        </svg>
                                    </div>
                                </motion.div>
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
                                                {new Date(
                                                    albums[index].createdAt
                                                ).toLocaleDateString()}
                                            </div>
                                            <span>/</span>
                                            <div>{albums[index].tags}</div>
                                        </motion.div>

                                        <motion.textarea
                                            readOnly
                                            className="w-full h-36 text-white bg-transparent resize-none overflow-hidden focus:overflow-auto focus:outline-none"
                                            variants={infoColVariants}
                                            value={
                                                albums[index].description || ""
                                            }
                                        ></motion.textarea>
                                        <motion.div
                                            className="w-full items-center text-center"
                                            variants={infoColVariants}
                                        >
                                            <Link href={`/${albums[index].id}`}>
                                                <a className="bg-gray-300 hover:bg-gray-400 text-gray-800  font-bold py-2 px-4 rounded-full">
                                                    앨범 내부 편집
                                                </a>
                                            </Link>
                                        </motion.div>
                                    </MotionConfig>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    <motion.div
                        onClick={() => {
                            setOpenModal(true);
                            setModalTitle("앨범 생성");
                            setModalContentType(1);
                        }}
                        className="absolute right-4 bottom-4 text-slate-100 cursor-pointer"
                    >
                        <div>
                            <svg
                                aria-label="새로운 게시물"
                                color="#ddd"
                                fill="#ddd"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <path
                                    d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
                                    fill="none"
                                    stroke="currentColor"
                                ></path>
                                <line
                                    fill="none"
                                    stroke="currentColor"
                                    x1="6.545"
                                    x2="17.455"
                                    y1="12.001"
                                    y2="12.001"
                                ></line>
                                <line
                                    fill="none"
                                    stroke="currentColor"
                                    x1="12.003"
                                    x2="12.003"
                                    y1="6.545"
                                    y2="17.455"
                                ></line>
                            </svg>
                        </div>
                    </motion.div>
                </div>
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
            <Dialog
                open={openDialog}
                title={dialogTitle}
                content={dialogContent}
                buttons={dialogButtons}
                onCloseCallback={() => setOpenDialog(false)}
            />
            <Modal
                open={openModal}
                title={modalTitle}
                big={modalContentType !== 3}
                onCloseCallback={() => {
                    setOpenModal(false);
                }}
            >
                {modalContentType !== 3 && (
                    <AlbumForm
                        data={data?.albums || []}
                        album={
                            modalContentType === 1 ? undefined : albums[index]
                        }
                    />
                )}
                {modalContentType === 3 && (
                    <div className="flex flex-col items-center justify-center bg-white w-full rounded-xl space-y-8">
                        <QRCodeCanvas
                            id="qrCode"
                            value={`http://localhost:3000/other/${user?.id}`}
                            size={256}
                        />

                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => {
                                    const qrCode = document.getElementById(
                                        "qrCode"
                                    ) as HTMLCanvasElement;
                                    if (qrCode) {
                                        qrCode.toBlob(async (blob) => {
                                            if (blob) {
                                                try {
                                                    await navigator.clipboard.write(
                                                        [
                                                            new ClipboardItem({
                                                                [blob.type]:
                                                                    blob,
                                                            }),
                                                        ]
                                                    );

                                                    alert("Copy Succes!");
                                                } catch {
                                                    alert("Copy Fail!");
                                                }
                                            } else alert("Copy Fail!");
                                        });
                                    } else alert("Copy Fail!");
                                }}
                                className="py-2 px-3 bg-black text-white rounded-md"
                            >
                                QR COPY
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(
                                            `http://localhost:3000/other/${user?.id}`
                                        );
                                        alert("Copy Succes!");
                                    } catch {
                                        alert("Copy Fail!");
                                    }
                                }}
                                className="py-2 px-3 bg-black text-white rounded-md"
                            >
                                URL COPY
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
interface IPageProps extends BaseProps {
    albums: Album[];
}

const Page: NextPage<IPageProps> = ({ albums, user }) => {
    return (
        <SWRConfig
            value={{
                fallback: { "/api/albums/me": { ok: true, albums } },
            }}
        >
            <Home user={user} />
        </SWRConfig>
    );
};

export async function getServerSideProps({ req }: NextPageContext) {
    const session = await getSession({ req });
    if (session) {
        const albums = await client.album.findMany({
            where: { userId: session.user.id },
        });
        return { props: { albums: JSON.parse(JSON.stringify(albums)) } };
    }
    return {
        redirect: {
            permanent: false,
            destination: "/auth/enter",
        },
        props: {},
    };
}
export default Page;
