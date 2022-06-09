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
        const albums = await client.album.findMany({
            where: { userId: session.user.id },
        });

        res.json({
            ok: true,
            albums,
        });
    } else if (req.method === "POST") {
        const { title, description, password, tags } = req.body;

        const album = await client.album.create({
            data: {
                title,
                password,
                description,
                tags,
                pages: {
                    create: { no: 1 },
                },
                user: { connect: { id: session.user.id } },
            },
        });

        return res.json({ ok: true, album });
    }
}

export default widthHandler({
    methods: ["GET", "POST"],
    handler,
});
