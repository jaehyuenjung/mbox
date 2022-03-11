import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";

interface EnterForm {
    email: string;
}

const MagicLinkModal = ({ show = false, email = "" }) => {
    if (!show) return null;

    return createPortal(
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
                        We emailed a magic link to <strong>{email}</strong>.
                        Check your inbox and click the link in the email to
                        login.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Enter: NextPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { register, handleSubmit, getValues } = useForm<EnterForm>();
    const [showModal, setShowModal] = useState(false);
    const onValid = ({ email }: EnterForm) => {
        signIn("email", {
            email,
            redirect: false,
            callbackUrl: `${window.location.origin}/auth/confirmRequest`,
        })
            .then(() => setShowModal(true))
            .catch((error) => {});
    };

    if (session) {
        router.replace("/");
    }

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
                <h1 className="mt-2 text-2xl sm:text-4xl text-center font-bold">
                    Sign in to your account
                </h1>
                <form
                    onSubmit={handleSubmit(onValid)}
                    className="mt-8 rounded-lg shadow-md bg-white px-4 py-6 sm:px-8 sm:py-8 space-y-6 w-full max-w-md"
                >
                    <div className="flex flex-col space-y-1">
                        <label
                            htmlFor="email"
                            className="text-gray-500 text-sm"
                        >
                            Email address
                        </label>
                        <input
                            {...register("email", { required: true })}
                            id="email"
                            type="email"
                            required
                            placeholder="elon@spacex.com"
                            className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-blue-400 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed "
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 transition"
                    >
                        Sign in
                    </button>
                </form>
            </div>
            <MagicLinkModal show={showModal} email={getValues("email")} />
        </>
    );
};

export default Enter;
