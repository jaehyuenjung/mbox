import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const session = await getSession({ req });

        if (!session) return res.json({ ok: false });

        const albums = await client.album.findMany({
            where: { userId: session.user.id },
        });

        res.json({
            ok: true,
            albums,
        });
    }
}

export default widthHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
});
