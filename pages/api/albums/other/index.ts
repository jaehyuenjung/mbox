import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { userId } = req.query;

    if (userId) return res.json({ ok: false, error: "" });

    if (req.method === "GET") {
        const albums = await client.album.findMany({
            where: { userId },
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
