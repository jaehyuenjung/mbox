import { useRouter } from "next/router";
import { NextPage } from "next";
import useUser from "@libs/client/useUser";
import { useEffect, useMemo } from "react";
import { signIn } from "next-auth/react";

const CheckEmail: NextPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const sendEmail = async (email: string) => {
        await signIn("email", {
            email,
            redirect: false,
            callbackUrl: `${window.location.origin}/auth/confirmRequest`,
        });
    };
    useEffect(() => {
        if (user && (user.accounts.length || user.emailVerified)) {
            router.replace("/");
        } else if (user && user.email && !user.emailVerified) {
            sendEmail(user.email);
        }
    }, [user, router]);
    return (
        <div className="fixed inset-0 z-10 bg-white bg-opacity-90 backdrop-filter backdrop-blur-md backdrop-grayscale">
            <div className="min-h-screen px-6 flex flex-col items-center justify-center animate-zoomIn">
                <div className="flex flex-col items-center justify-center text-center max-w-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 w-12 h-12 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                        />
                    </svg>
                    <h3 className="mt-2 text-2xl font-semibold">
                        Confirm your email
                    </h3>
                    <p className="mt-4 text-lg">
                        We emailed a magic link to{" "}
                        <strong>{user?.email}</strong>. Check your inbox and
                        click the link in the email to login.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckEmail;
