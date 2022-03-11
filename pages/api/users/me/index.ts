import widthHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const session = await getSession({ req });

    const profile = await client.user.findUnique({
        where: { id: session?.user.id },
    });

    res.json({
        ok: true,
        profile,
    });
}

export default widthHandler({ methods: ["GET"], handler });
