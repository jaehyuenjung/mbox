import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { albumId } = req.query;

    if (!albumId || Number(albumId) === NaN)
        return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({
        where: { id: +albumId },
        include: {
            _count: {
                select: {
                    pages: true,
                },
            },
        },
    });

    if (!album) return res.json({ ok: false, error: "" });
    if (req.method === "GET") {
        const { page } = req.query;

        if (page !== undefined && Number(page) === NaN)
            return res.json({ ok: false, error: "" });

        if (page) {
            const pagination = await client.pagination.findFirst({
                where: {
                    albumId: +albumId,
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
                    albumId: +albumId,
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
    }
}

export default widthHandler({
    methods: ["GET"],
    handler,
});
