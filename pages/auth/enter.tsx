import { NextPage, NextPageContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { RedirectableProviderType } from "next-auth/providers";
import Link from "next/link";
import { useEffect, useState } from "react";
import Input from "@components/input";
import SNSIcon from "@components/sns-icon";
import { mutate } from "swr";
import { BaseProps } from "@components/layout";
import { createPortal } from "react-dom";

interface EnterForm {
    email: string;
    password: string;
}

const Enter: NextPage<BaseProps> = ({ user }) => {
    const router = useRouter();
    const { error } = router.query;
    const [formError, setFormError] = useState<string>();
    const { register, handleSubmit, setValue } = useForm<EnterForm>();
    const onValid = ({ email, password }: EnterForm) => {
        setFormError("");

        signIn<RedirectableProviderType>("credentials", {
            email,
            password,
            redirect: false,
        }).then(async (response) => {
            if (response) {
                if (response.error) {
                    setValue("password", "");
                    setFormError(response.error);
                } else {
                    await mutate("/api/users/me");
                    router.replace("/auth/checkEmail");
                }
            }
        });
    };
    useEffect(() => {
        if (user && (user.accounts?.length || user.emailVerified)) {
            router.replace("/");
        }
    }, [user, router]);
    console.log(error);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 mx-auto">
            <h1 className="mt-2 text-2xl sm:text-4xl text-center font-bold">
                Sign in to your account
            </h1>
            <form
                onSubmit={handleSubmit(onValid)}
                className="mt-8 rounded-lg shadow-md bg-white px-4 py-6 sm:px-8 sm:py-8 flex flex-col gap-3 w-full max-w-md"
            >
                {formError && (
                    <div className="border-l-2 border-red-500 pl-4 py-2 font-medium text-sm text-red-500">
                        {formError}
                    </div>
                )}
                <div className="flex flex-col space-y-2 my-3">
                    <Input
                        label="Email Address"
                        register={register("email", { required: true })}
                        id="email"
                        type="email"
                    />
                    <Input
                        label="Password"
                        register={register("password", { required: true })}
                        id="password"
                        type="password"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-md text-white bg-gray-800 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 transition"
                >
                    Sign in
                </button>

                <p className="text-sm text-center text-gray-600">
                    New to mbox?{" "}
                    <Link href="/auth/register">
                        <a className="font-bold text-blue-600">
                            Sign up for an account.
                        </a>
                    </Link>
                </p>

                <div className="flex flex-col space-y-7 py-3">
                    <div className="relative h-[2px] flex justify-center items-center bg-gray-200">
                        <div className="absolute bg-white p-2 font-bold">
                            Or
                        </div>
                    </div>
                    <div className="flex justify-center items-center space-x-5">
                        <SNSIcon kind="kakao" isSignIn />
                        <SNSIcon kind="naver" isSignIn />
                        <SNSIcon kind="facebook" isSignIn />
                    </div>
                </div>
            </form>
            <MagicLinkModal error={error ? String(error) : undefined} />
        </div>
    );
};

const MagicLinkModal = ({
    error = undefined,
}: {
    error: string | undefined;
}) => {
    const errors = {
        Signin: "Try signing with a different account.",
        OAuthSignin: "Try signing with a different account.",
        OAuthCallback: "Try signing with a different account.",
        OAuthCreateAccount: "Try signing with a different account.",
        EmailCreateAccount: "Try signing with a different account.",
        Callback: "Try signing with a different account.",
        OAuthAccountNotLinked:
            "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "Check your email address.",
        CredentialsSignin:
            "Sign in failed. Check the details you provided are correct.",
        default: "Unable to sign in.",
    } as { [key: string]: string };

    const router = useRouter();
    const errorMessage = error && (errors[error] ?? errors.default);
    const onClick = () => {
        router.replace("/auth/enter");
    };

    if (!error) return null;
    return createPortal(
        <div
            onClick={onClick}
            className="fixed inset-0 z-10 bg-white bg-opacity-90 backdrop-filter backdrop-blur-md backdrop-grayscale"
        >
            <div className="min-h-screen px-6 flex flex-col items-center justify-center animate-zoomIn">
                {errorMessage}
            </div>
        </div>,
        document.body
    );
};

export default Enter;
