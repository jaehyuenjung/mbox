import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const session = await getSession({ req });

    if (!session) return res.json({ ok: false, error: "" });

    if (req.method === "GET") {
        const { id, page } = req.query;

        if (!id || (page !== undefined && Number(page) === NaN))
            return res.json({ ok: false, error: "" });

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
                page: { ...pagination, totalPage: album._count.pages },
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
                page: { ...pagination, totalPage: album._count.pages },
            });
        }
    }
}

export default widthHandler({
    methods: ["GET"],
    handler,
});
