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
        body: { checkPassword },
    } = req;
    const session = await getSession({ req });

    if (!session) return res.json({ ok: false, error: "" });

    const album = await client.album.findUnique({ where: { id: +id } });

    if (!album) return res.json({ ok: false, error: "" });
    if (album.userId !== session.user.id)
        return res.json({ ok: false, error: "" });
    // if (album.password && (await bcrypt.compare(album.password, checkPassword)))
    //     return res.json({ ok: false, error: "" });

    if (req.method === "POST") {
        const { title, description, password } = req.body;
        const data: any = {};

        if (title) data.title = title;
        if (description) data.description = description;
        if (password) data.password = password;

        await client.album.update({
            where: { id: +id },
            data,
        });

        return res.json({ ok: true });
    } else if (req.method === "DELETE") {
        await client.album.delete({ where: { id: album.id } });

        return res.json({ ok: true });
    }
}

export default widthHandler({
    methods: ["POST", "DELETE"],
    handler,
});
