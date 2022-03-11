import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SWRConfig
            value={{
                fetcher: (url: string) =>
                    fetch(url).then((response) => response.json()),
            }}
        >
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </SWRConfig>
    );
}

export default MyApp;
