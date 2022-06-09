import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { albumId },
    } = req;
    const session = await getSession({ req });

    if (!session || !albumId) return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({ where: { id: +albumId } });

    if (!album) return res.json({ ok: false, error: "" });
    if (album.userId !== session.user.id)
        return res.json({ ok: false, error: "" });

    if (req.method === "POST") {
        const { title, description, width, height, tags, paginationId } =
            req.body;

        if (!paginationId || Number(paginationId) === NaN)
            return res.json({ ok: false, error: "" });

        const pagination = await client.pagination.findFirst({
            where: {
                id: paginationId,
                album,
            },
        });

        if (!pagination) return res.json({ ok: false, error: "" });

        const photo = await client.photo.create({
            data: {
                title,
                description,
                width,
                height,
                tags,
                paginationId: pagination.id,
            },
        });

        return res.json({ ok: true, photo });
    }
}

export default widthHandler({
    methods: ["POST"],
    handler,
});
