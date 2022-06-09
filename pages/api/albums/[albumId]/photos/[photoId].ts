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
        query: { albumId, photoId },
    } = req;
    const session = await getSession({ req });

    if (!session || !albumId || !photoId)
        return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({ where: { id: +albumId } });

    if (!album) return res.json({ ok: false, error: "" });
    if (album.userId !== session.user.id)
        return res.json({ ok: false, error: "" });

    const photo = await client.photo.findFirst({
        where: {
            id: +photoId,
            pagination: {
                albumId: album.id,
            },
        },
    });

    if (!photo) return res.json({ ok: false, error: "" });

    if (req.method === "POST") {
        const { title, description, width, height, tags, imagePath } = req.body;
        const data: any = {};

        if (title) data.title = title;
        if (description) data.description = description;
        if (width) data.width = width;
        if (height) data.height = height;
        if (tags) data.tags = tags;
        if (imagePath) data.imagePath = imagePath;

        await client.photo.update({
            where: { id: +photoId },
            data,
        });

        return res.json({ ok: true });
    } else if (req.method === "DELETE") {
        await client.photo.delete({ where: { id: photo.id } });
        return res.json({ ok: true });
    }
}

export default widthHandler({
    methods: ["POST", "DELETE"],
    handler,
});
