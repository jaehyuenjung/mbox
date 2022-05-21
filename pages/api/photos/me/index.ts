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
        const { albumId } = req.query;

        if (!albumId) return res.json({ ok: false, error: "" });

        const album = await client.album.findUnique({
            where: { id: +albumId },
            include: {},
        });

        if (!album) return res.json({ ok: false, error: "" });

        // return res.json({ ok: true, ...album.photos });
    }
}

export default widthHandler({
    methods: ["GET"],
    handler,
});
