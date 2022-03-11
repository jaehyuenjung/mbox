import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

const ConfirmRequest: NextPage = () => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const router = useRouter();

    if (!loading && !session) {
        router.replace("/auth/enter");
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 max-w-md mx-auto">
            {loading ? (
                <p>Loading...</p>
            ) : !session ? (
                <p>Redirecting...</p>
            ) : (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-14 h-14 sm:w-16 sm:h-16 text-blue-600 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h1 className="text-2xl sm:text-4xl font-bold mt-4">
                        You&apos;re logged in!
                    </h1>
                    <p className="text-lg sm:text-2xl mt-4">
                        Go back to your original tab.
                    </p>
                    <p className="text-normal sm:text-lg text-gray-500 mt-6">
                        You can close this window or click{" "}
                        <Link href="/">
                            <a className="text-blue-500 hover:underline hover:text-blue-600">
                                this link
                            </a>
                        </Link>{" "}
                        to go back to the homepage.
                    </p>
                </>
            )}
        </div>
    );
};

export default ConfirmRequest;
