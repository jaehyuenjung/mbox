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
        query: { id },
        body: { photoId },
    } = req;
    const session = await getSession({ req });

    if (!session) return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({ where: { id: +id } });

    if (!album) return res.json({ ok: false, error: "" });
    if (album.userId !== session.user.id)
        return res.json({ ok: false, error: "" });

    if (req.method === "POST") {
        const { title, description, width, height, tags, imagePath, no } =
            req.body;

        if (!no || Number(no) === NaN) return res.json({ ok: false });

        const pagination = await client.pagination.findFirst({
            where: {
                albumId: +id,
                no,
            },
        });

        if (!pagination) return res.json({ ok: false });

        if (photoId) {
            const data: any = {
                width,
                height,
            };
            const alreadyExist = await client.photo.findUnique({
                where: { id: +photoId },
            });

            if (!alreadyExist) return res.json({ ok: false });

            if (title) data.title = title;
            if (description) data.description = description;
            if (tags) data.tags = tags;
            if (imagePath) data.imagePath = imagePath;

            await client.photo.update({
                where: { id: +photoId },
                data,
            });
        } else {
            const data: any = {
                pagination: {
                    connect: {
                        id: pagination.id,
                    },
                },
                width,
                height,
            };

            if (title) data.title = title;
            if (description) data.description = description;
            if (tags) data.tags = tags;
            if (imagePath) data.imagePath = imagePath;

            await client.photo.create({
                data,
            });
        }
        return res.json({ ok: true });
    } else if (req.method === "DELETE") {
        if (!photoId) return res.json({ ok: false });

        const photo = await client.photo.findUnique({ where: { id: photoId } });

        if (!photo) return res.json({ ok: false, error: "" });

        await client.photo.delete({ where: { id: photoId } });
        return res.json({ ok: true });
    }
}

export default widthHandler({
    methods: ["POST", "DELETE"],
    handler,
});
