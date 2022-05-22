import { BaseProps } from "@components/layout";
import {
    GetStaticPaths,
    GetStaticProps,
    NextPage,
    NextPageContext,
} from "next";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import useCanvasSize from "@libs/client/useCanvasSize";
import client from "@libs/server/client";
import { Pagination, Photo } from "@prisma/client";
import { ResponseType } from "@libs/server/withHandler";
import useSWR, { SWRConfig } from "swr";
import { useRouter } from "next/router";

const ReadCanvas = dynamic(() => import("@components/read-canvas"), {
    ssr: false,
});

interface IPaginationDetail extends Pagination {
    photos: Photo[];
    totalPage: number;
}

interface PaginationResponse extends ResponseType {
    pagination: IPaginationDetail;
}

interface IForm {
    no: number;
}

const Detail: NextPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<IForm>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [back, setBack] = useState(false);
    const [delay, setDelay] = useState(false);
    const { width, height } = useCanvasSize(containerRef);
    const { data } = useSWR<PaginationResponse>(
        router.query.userId && router.query.albumId
            ? Number(router.query.page)
                ? `/api/pages/other/${router.query.userId}/${router.query.albumId}?page=${router.query.page}`
                : `/api/pages/other/${router.query.userId}/${
                      router.query.albumId
                  }?page=${1}`
            : null
    );

    const page = Number(router.query.page) ? Number(router.query.page) : 1;

    const pageMove = async (no: number) => {
        if (data && 1 <= no && data.pagination.totalPage >= no) {
            if (page < no) {
                const promise = new Promise((resolve, reject) => {
                    setBack(false);
                    resolve(null);
                });

                promise.then(() =>
                    router.replace(router.asPath.split("?")[0] + `?page=${no}`)
                );
            } else if (page > no) {
                const promise = new Promise((resolve, reject) => {
                    setBack(true);
                    resolve(null);
                });

                promise.then(() =>
                    router.replace(router.asPath.split("?")[0] + `?page=${no}`)
                );
            }
        }
    };

    const onValid = ({ no }: IForm) => {
        if (data) {
            if (no && 1 <= no && data.pagination.totalPage >= no) {
                pageMove(no);
            }
        }
    };

    return (
        <div className="bg-black">
            {data?.pagination ? (
                <>
                    {page > 1 && (
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
                    )}
                    {page < data.pagination.totalPage && (
                        <div className="absolute right-0 h-full flex items-center text-gray-500 z-50">
                            <svg
                                onClick={() => {
                                    if (!delay) {
                                        setDelay(true);
                                        pageMove(page + 1);
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
                    )}
                    <div className="absolute left-0 top-[95%] w-full text-gray-500 z-50 select-none">
                        <div className="relative flex justify-center items-end space-x-2 text-white">
                            <span>{page}</span>
                            <span>/</span>
                            <span>{data.pagination.totalPage}</span>
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
                    <div>
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
                                <ReadCanvas
                                    key={page}
                                    width={width}
                                    height={height}
                                    photos={data.pagination.photos}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </>
            ) : null}
        </div>
    );
};

interface IFallback {
    [key: string]: PaginationResponse;
}

interface PageProps {
    fallback: IFallback;
}

const Page: NextPage<PageProps> = ({ fallback }) => {
    return (
        <SWRConfig
            value={{
                fallback,
            }}
        >
            <Detail />
        </SWRConfig>
    );
};

export async function getServerSideProps({ req, query }: NextPageContext) {
    const { userId, albumId, page } = query;

    const isExist = await client.user.findUnique({
        where: { id: String(userId) },
    });

    if (!isExist) return { notFound: true };

    if (albumId && Number(albumId) !== NaN) {
        let key;
        let pagination;

        if (page && Number(page) !== NaN) {
            key = `/api/pages/other/${userId}/${albumId}?page=${page}`;
            pagination = await client.pagination.findFirst({
                where: {
                    albumId: +albumId,
                    no: +page,
                },
                include: {
                    photos: true,
                },
            });
        } else if (page === undefined) {
            key = `/api/pages/other/${userId}/${albumId}?page=${1}`;
            pagination = await client.pagination.findFirst({
                where: {
                    albumId: +albumId,
                    no: 1,
                },
                include: {
                    photos: true,
                },
            });
        } else return { notFound: true };

        if (pagination) {
            const album = await client.album.findUnique({
                where: { id: +albumId },
                include: { _count: { select: { pages: true } } },
            });
            if (album) {
                const fallback: IFallback = {};
                fallback[key] = {
                    ok: true,
                    pagination: JSON.parse(
                        JSON.stringify({
                            ...pagination,
                            totalPage: album._count.pages,
                        })
                    ),
                };
                return {
                    props: {
                        fallback,
                    },
                };
            }
        }
    }
    return { notFound: true };
}

export default Page;
