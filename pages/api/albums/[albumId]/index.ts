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
        body: { checkPassword },
    } = req;
    const session = await getSession({ req });

    if (!session) return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({ where: { id: +albumId } });

    if (!album) return res.json({ ok: false, error: "" });
    if (album.userId !== session.user.id)
        return res.json({ ok: false, error: "" });
    // if (album.password && (await bcrypt.compare(album.password, checkPassword)))
    //     return res.json({ ok: false, error: "" });

    if (req.method === "POST") {
        const { title, description, tags, password, imagePath } = req.body;
        const data: any = {};

        if (title) data.title = title;
        if (description) data.description = description;
        if (tags) data.tags = tags;
        if (password) data.password = password;
        if (imagePath) data.imagePath = imagePath;

        const album = await client.album.update({
            where: { id: +albumId },
            data,
        });

        return res.json({ ok: true, album });
    } else if (req.method === "DELETE") {
        await client.album.delete({ where: { id: album.id } });

        return res.json({ ok: true });
    }
}

export default widthHandler({
    methods: ["POST", "DELETE"],
    handler,
});
