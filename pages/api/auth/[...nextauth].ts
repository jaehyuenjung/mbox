import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import nodemailer from "nodemailer";
import client from "@libs/server/client";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";

interface TokenType extends JWT {
    user?: User;
}

interface SessionType {
    session: Session;
    token: TokenType;
    user?: User;
}

export default NextAuth({
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.user = { id: user.id };
            }
            return token;
        },
        async session({ session, token, user }: SessionType) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/enter",
        signOut: "/auth/enter",
        error: "/auth/enter",
    },
    adapter: PrismaAdapter(client),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const { email, password } = credentials!;

                const profile = await client.user.findUnique({
                    where: { email },
                });

                const checkPassword = await bcrypt.compare(
                    password,
                    String(profile?.password)
                );
                if (profile && checkPassword) {
                    return profile;
                }
                throw new Error("Incorrect email or password.");
            },
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: +process.env.EMAIL_SERVER_PORT!,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({
                identifier: email,
                url,
                provider: { server, from },
            }) {
                const { host } = new URL(url);
                const transport = nodemailer.createTransport(server);
                await transport.sendMail({
                    to: email,
                    from,
                    subject: `Sign in to ${host}`,
                    text: text({ url, host }),
                    html: html({ url, host, email }),
                });
            },
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60,
    },

    secret: process.env.AUTH_SECRET,
});

function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
    // Insert invisible space into domains and email address to prevent both the
    // email address and the domain from being turned into a hyperlink by email
    // clients like Outlook and Apple mail, as this is confusing because it seems
    // like they are supposed to click on their email address to sign in.
    const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
    const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

    // Some simple styling options
    const backgroundColor = "#f9f9f9";
    const textColor = "#444444";
    const mainBackgroundColor = "#ffffff";
    const buttonBackgroundColor = "#346df1";
    const buttonBorderColor = "#346df1";
    const buttonTextColor = "#ffffff";

    return `
<body style="background: ${backgroundColor};">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
  <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
    <strong>${escapedHost}</strong>
  </td>
</tr>
</table>
<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
<tr>
  <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
    Sign in as <strong>${escapedEmail}</strong>
  </td>
</tr>
<tr>
  <td align="center" style="padding: 20px 0;">
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
    If you did not request this email you can safely ignore it.
  </td>
</tr>
</table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
    return `Sign in to ${host}\n${url}\n\n`;
}
