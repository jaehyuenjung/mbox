import { NextPage, NextPageContext } from "next";
import { getSession } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { Album, Pagination, Photo } from "@prisma/client";
import { useRouter } from "next/router";
import { ResponseType } from "@libs/server/withHandler";
import { useEffect, useState } from "react";
import PhotoForm from "@components/photo-form";
import Card from "@components/card";
import useMutation from "@libs/client/useMutation";
import dynamic from "next/dynamic";
import photos from "./api/albums/[albumId]/photos";

interface IPaginationDetail extends Pagination {
    photos: Photo[];
    totalPage: number;
}

interface PaginationResponse extends ResponseType {
    pagination: IPaginationDetail;
}

const Detail: NextPage = () => {
    const router = useRouter();

    const [createPage, { loading: pageCreateLoading }] = useMutation(
        `/api/pages/me/${router.query.id}`,
        "POST"
    );
    const [deletePage, { loading: pageDeleteLoading }] = useMutation(
        `/api/pages/me/${router.query.id}`,
        "DELETE"
    );
    const [page, setPage] = useState(1);
    const { data, mutate } = useSWR<PaginationResponse>(
        router.query.id ? `/api/pages/me/${router.query.id}?page=${page}` : null
    );
    const [selected, setSelected] = useState<Photo>();

    const onCreatePhoto = () => {
        if (data) {
            const tump: Photo = {
                id: Date.now(),
                title: "",
                description: "",
                imagePath: "/noimage.jpg",
                tags: "",
                paginationId: data.pagination.id,
                width: 200,
                height: 200,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const newData = { ...data };
            newData.pagination.photos = [...data.pagination.photos, tump];
            mutate(newData, false);
            setSelected(tump);
        }
    };

    const onChangePhoto = (deleteId: number, newPhoto: Photo) => {
        if (data) {
            const newData = { ...data };
            newData.pagination.photos = [
                ...data.pagination.photos.filter((p) => p.id !== deleteId),
                newPhoto,
            ];
            mutate(newData, false);
            setSelected(newPhoto);
        }
    };

    const onDeletePhoto = (id?: number) => {
        if (id !== undefined && data) {
            const newData = { ...data };
            newData.pagination.photos = [...data.pagination.photos].filter(
                (photo) => photo.id !== id
            );
            mutate(newData, false);
            fetch(`/api/albums/${router.query.id}/photos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    };

    const onCreatePage = () => {
        if (data) {
            const newData = { ...data };
            const newTotalPage = data.pagination.totalPage + 1;
            newData.pagination = {
                ...data.pagination,
                totalPage: newTotalPage,
            };
            mutate(newData, false);
            if (!pageCreateLoading && !pageDeleteLoading) {
                createPage({ no: newTotalPage });
            }
        }
    };

    const onDeletePage = (id?: number) => {
        if (id && data) {
            const newData = { ...data };
            const newTotalPage = data.pagination.totalPage - 1;
            newData.pagination = {
                ...data.pagination,
                totalPage: newTotalPage,
            };
            mutate(newData, false);
            if (!pageDeleteLoading) {
                deletePage({ no: id });

                if (newTotalPage < page) {
                    setPage((prev) => prev - 1);
                }
            }
        }
    };

    const onClickPhoto = (id?: number) => {
        if (id && data) {
            const photo = data.pagination.photos.find(
                (photo) => photo.id === id
            );

            setSelected(photo);
        }
    };

    const onClickPage = (id?: number) => {
        if (id) {
            setPage(id);
        }
    };

    if (data && !data.ok) {
        router.push("/404");
    }
    return (
        <div className="w-full h-full flex min-w-[1200px]">
            <div
                className={
                    "w-[15%] h-full p-2 bg-slate-100 overflow-y-scroll flex flex-col items-center space-y-2"
                }
            >
                <h2 className="font-bold text-[15px]">Images</h2>
                {data && (
                    <div className="w-full space-y-1">
                        {data.pagination.photos.map((photo, key) => (
                            <Card
                                onClick={onClickPhoto}
                                key={photo.id}
                                item={photo}
                                onDelete={onDeletePhoto}
                            />
                        ))}
                        {data.pagination.photos.length < 10 && (
                            <div
                                className={
                                    "flex justify-center items-center aspect-square mx-12 font-bold"
                                }
                            >
                                <svg
                                    onClick={onCreatePhoto}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[70%] w-[70%]  cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 bg-slate-600 p-5">
                <div className="flex flex-col space-y-3 w-full h-full bg-slate-200 rounded-3xl p-5">
                    {selected && (
                        <PhotoForm
                            photo={selected}
                            onChangePhoto={onChangePhoto}
                        />
                    )}
                </div>
            </div>

            <div className="w-[15%] h-full p-2 bg-slate-100 overflow-y-scroll flex flex-col items-center space-y-2">
                <div className="font-bold text-[15px]">Pages</div>
                {data && (
                    <div className="w-full space-y-1">
                        {Array.from(
                            { length: data.pagination.totalPage },
                            (_, i) => i + 1
                        ).map((no) => (
                            <Card
                                onClick={onClickPage}
                                key={no}
                                isPhoto={false}
                                item={{
                                    id: no,
                                    title: no + "page",
                                    imagePath: "",
                                }}
                                onDelete={onDeletePage}
                            />
                        ))}
                        <div className="flex justify-center items-center aspect-square mx-12 font-bold">
                            <svg
                                onClick={onCreatePage}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[70%] w-[70%]  cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
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
    const session = await getSession({ req });
    if (session) {
        const { id, page } = query;

        if (id && Number(id) !== NaN) {
            let key;
            let pagination;
            if (page && Number(page) !== NaN) {
                key = `/api/pages/me/${id}?page=${page}`;
                pagination = await client.pagination.findFirst({
                    where: {
                        albumId: +id,
                        no: +page,
                    },
                    include: {
                        photos: true,
                    },
                });
            } else if (page === undefined) {
                key = `/api/pages/me/${id}?page=${1}`;
                pagination = await client.pagination.findFirst({
                    where: {
                        albumId: +id,
                        no: 1,
                    },
                    include: {
                        photos: true,
                    },
                });
            } else return { notFound: true };

            if (pagination) {
                const album = await client.album.findUnique({
                    where: { id: +id },
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
            return { notFound: true };
        }
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
