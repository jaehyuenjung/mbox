import { NextPage, NextPageContext } from "next";
import { getSession } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { Album, Pagination, Photo } from "@prisma/client";
import { useRouter } from "next/router";
import { ResponseType } from "@libs/server/withHandler";

interface IPaginationDetail extends Pagination {
    photos: Photo[];
    totalPage: number;
}

interface PaginationResponse extends ResponseType {
    pagination: IPaginationDetail;
}

const Detail: NextPage = () => {
    const router = useRouter();
    const { data } = useSWR<PaginationResponse>(
        router.query.id
            ? router.query.page
                ? `/api/detail/me/${router.query.id}?page=${router.query.page}`
                : `/api/detail/me/${router.query.id}?page=${1}`
            : null
    );
    console.log(data);
    if (data && !data.ok) {
        router.push("/404");
    }
    return null;
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
                key = `/api/detail/me/${id}?page=${page}`;
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
                key = `/api/detail/me/${id}?page=${1}`;
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
                        pagination: {
                            ...pagination,
                            totalPage: album._count.pages,
                        },
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
