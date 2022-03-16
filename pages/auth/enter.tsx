import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { RedirectableProviderType } from "next-auth/providers";
import Link from "next/link";
import { useState } from "react";
import Input from "@components/input";
import SNSIcon from "@components/sns-icon";

interface EnterForm {
    email: string;
    password: string;
}

const Enter: NextPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [error, setError] = useState<string>();
    const { register, handleSubmit } = useForm<EnterForm>();
    const onValid = async ({ email, password }: EnterForm) => {
        setError("");

        const response = await signIn<RedirectableProviderType>("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: `${window.location.origin}/auth/checkEmail`,
        });

        if (response) {
            if (response.error) {
                setError(response.error);
            } else {
                router.replace("/auth/checkEmail");
            }
        }
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
                    className="mt-8 rounded-lg shadow-md bg-white px-4 py-6 sm:px-8 sm:py-8 flex flex-col gap-3 w-full max-w-md"
                >
                    {error && (
                        <div className="border-l-2 border-red-500 pl-4 py-2 font-medium text-sm text-red-500">
                            {error}
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
                            <SNSIcon kind="kakao" />
                            <SNSIcon kind="naver" />
                            <SNSIcon kind="facebook" />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Enter;
