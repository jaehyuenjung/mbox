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

        const profile = await client.user.findUnique({
            where: { id: session.user.id },
            include: {
                accounts: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        res.json({
            ok: true,
            profile,
        });
    }
    if (req.method === "POST") {
        const { email, name, password } = req.body;

        const alreadyExist = await client.user.findFirst({
            where: {
                OR: [{ email }],
            },
        });

        if (alreadyExist && alreadyExist.email === email) {
            return res.json({
                ok: false,
                error: "Email is invalid or has already been taken",
            });
        }

        const hash = await bcrypt.hash(password, 12);

        await client.user.create({
            data: {
                email,
                name,
                password: hash,
            },
        });

        res.json({
            ok: true,
        });
    }
}

export default widthHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
});
