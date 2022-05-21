import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.ua?.isBot) {
        return new Response("Plz don't be a bot. Be buman.", { status: 403 });
    }
    if (!req.url.includes("/api")) {
        if (
            !req.url.includes("/auth/enter") &&
            !req.url.includes("/auth/register") &&
            !req.url.includes("/other") &&
            !req.cookies["next-auth.session-token"]
        ) {
            return NextResponse.redirect("http://localhost:3000/auth/enter");
        }
    }
}
