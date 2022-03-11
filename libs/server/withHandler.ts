import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
}

type method = "GET" | "POST" | "DELETE";

interface ConfigType {
    methods: method[];
    handler: (req: NextApiRequest, res: NextApiResponse) => void;
    isPrivate?: boolean;
}

export default function widthHandler({
    methods,
    handler,
    isPrivate = true,
}: ConfigType) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        const session = await getSession({ req });

        if (req.method && !methods.includes(req.method as any)) {
            return res.status(405).end();
        }
        if (isPrivate && (!session || !session.user)) {
            return res.status(401).json({ ok: false, error: "Plz log in." });
        }
        try {
            await handler(req, res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    };
}
