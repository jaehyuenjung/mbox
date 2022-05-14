import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
    return (
        <Html lang="ko">
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" />
            </Head>
            <body className="overflow-hidden">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
