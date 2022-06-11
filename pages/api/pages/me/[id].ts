import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { id } = req.query;
    const session = await getSession({ req });

    if (!session) return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({
        where: { id: +id },
        include: {
            _count: {
                select: {
                    pages: true,
                },
            },
        },
    });

    if (!album) return res.json({ ok: false, error: "" });
    if (album.userId !== session.user.id)
        return res.json({ ok: false, error: "" });

    if (req.method === "GET") {
        const { page } = req.query;

        if (!id || (page !== undefined && Number(page) === NaN))
            return res.json({ ok: false, error: "" });

        if (page) {
            const pagination = await client.pagination.findFirst({
                where: {
                    albumId: +id,
                    no: +page,
                },
                include: {
                    photos: true,
                },
            });

            return res.json({
                ok: true,
                pagination: { ...pagination, totalPage: album._count.pages },
            });
        } else {
            const pagination = await client.pagination.findFirst({
                where: {
                    albumId: +id,
                    no: 1,
                },
                include: {
                    photos: true,
                },
            });

            return res.json({
                ok: true,
                pagination: { ...pagination, totalPage: album._count.pages },
            });
        }
    } else if (req.method === "POST") {
        const { no } = req.body;

        if (!no || Number(no) === NaN)
            return res.json({ ok: false, error: "" });

        const pagination = await client.pagination.findFirst({
            where: {
                albumId: +id,
                no,
            },
        });

        if (pagination) return res.json({ ok: false, error: "" });

        await client.pagination.create({
            data: {
                albumId: +id,
                no,
            },
        });
        return res.json({ ok: true });
    } else if (req.method === "DELETE") {
        const { no } = req.body;

        if (!no || Number(no) === NaN)
            return res.json({ ok: false, error: "" });

        let paginations = await client.pagination.findMany({
            where: {
                albumId: +id,
            },
        });

        if (!paginations.find((pagination) => pagination.no === no))
            return res.json({ ok: false, error: "" });

        await client.pagination.deleteMany({
            where: {
                albumId: +id,
                no,
            },
        });

        paginations = paginations
            .filter((pagination) => pagination.no > no)
            .map((pagination) => ({ ...pagination, no: pagination.no - 1 }));

        paginations.forEach(async (pagination) => {
            await client.pagination.update({
                where: { id: pagination.id },
                data: { no: pagination.no },
            });
        });
        return res.json({ ok: true });
    }
}

export default widthHandler({
    methods: ["GET", "POST", "DELETE"],
    handler,
});
