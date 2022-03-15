import useMutation from "@libs/client/useMutation";
import { ResponseType } from "@libs/server/withHandler";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface EnterForm {
    email: string;
    name: string;
    password: string;
    passwordCheck: string;
}

interface CreateResponse extends ResponseType {
    error?: string;
}

const Register: NextPage = () => {
    const reg = new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/g
    );
    const router = useRouter();
    const { data: session } = useSession();
    const [strong, setStrong] = useState<boolean>();
    const [error, setError] = useState<string>();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<EnterForm>();
    const [create, { data, loading }] =
        useMutation<CreateResponse>("/api/users/me");

    const onValid = async ({
        email,
        name,
        password,
        passwordCheck,
    }: EnterForm) => {
        if (loading) return;
        setError("");

        const errorMessage = [] as string[];

        if (!/^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{3,}$/g.test(name)) {
            errorMessage.push(
                "Name must be at least 3 characters, letters and numbers only."
            );
        } else {
            if (!reg.test(password)) {
                errorMessage.push(
                    "Password is too weak. Minimum 10 characters and please include: 1 uppercase, digit, or special character. Password is leaked. This password was found in a data leak and can't be used."
                );
            }
            if (password !== passwordCheck) {
                errorMessage.push(
                    "Password confirmation doesn't match Password"
                );
            }

            if (password.length < 10) {
                errorMessage.push(
                    "Password is too short (minimum is 10 characters)"
                );
            }
        }

        if (errorMessage.length) {
            setError(errorMessage.join(" "));
        } else {
            create({ email, name, password });
        }

        setValue("password", "");
        setValue("passwordCheck", "");
    };
    watch(({ password }) => {
        if (password) {
            setStrong(reg.test(password));
        } else {
            setStrong(undefined);
        }
    });
    useEffect(() => {
        if (data) {
            if (data.ok) {
                router.replace("/auth/enter");
            } else if (!data.ok && data.error) {
                setError(data.error);
            }
        }
    }, [data, router, setError]);
    const onKakaoClick = async () => {
        await signIn("kakao", {
            redirect: false,
            callbackUrl: `${window.location.origin}/`,
        });
    };
    const onNaverClick = async () => {
        await signIn("naver", {
            redirect: false,
            callbackUrl: `${window.location.origin}/`,
        });
    };
    const onFacebookClick = async () => {
        await signIn("facebook", {
            redirect: false,
            callbackUrl: `${window.location.origin}/`,
        });
    };
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
                <h1 className="mt-2 text-2xl sm:text-4xl text-center font-bold">
                    Sign up for your account
                </h1>
                <form
                    onSubmit={handleSubmit(onValid)}
                    className="mt-8 rounded-lg shadow-md bg-white px-4 py-6 sm:px-8 sm:py-8 flex flex-col gap-3 w-full max-w-md"
                >
                    {error && (
                        <div className="border-l-2 border-blue-300 pl-4 py-2 font-medium text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col space-y-2 my-3">
                        <label
                            htmlFor="email"
                            className="text-gray-800 text-sm font-bold"
                        >
                            Email address
                        </label>
                        <input
                            {...register("email", { required: true })}
                            id="email"
                            type="email"
                            required
                            className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-blue-400 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed "
                        />
                        <label
                            htmlFor="email"
                            className="text-gray-800 text-sm font-bold"
                        >
                            Name
                        </label>
                        <input
                            {...register("name", { required: true })}
                            id="name"
                            type="text"
                            required
                            className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-blue-400 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed "
                        />
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="password"
                                className="text-gray-800 text-sm font-bold"
                            >
                                Password
                            </label>
                            {strong !== undefined ? (
                                <div className="flex items-center text-xs space-x-1">
                                    {strong ? (
                                        <span className="text-gray-600 font-semibold">
                                            Strong
                                        </span>
                                    ) : (
                                        <span className="text-gray-600 font-semibold">
                                            Leaked
                                        </span>
                                    )}
                                    {strong ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
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
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-red-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    )}
                                </div>
                            ) : null}
                        </div>
                        <input
                            {...register("password", { required: true })}
                            id="password"
                            type="password"
                            required
                            className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-blue-400 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed "
                        />
                        <label
                            htmlFor="passwordCheck"
                            className="text-gray-800 text-sm font-bold"
                        >
                            Password confirmation
                        </label>
                        <input
                            {...register("passwordCheck", { required: true })}
                            id="passwordCheck"
                            type="password"
                            required
                            className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-blue-400 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed "
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2 rounded-md text-white bg-gray-800 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 transition"
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <Link href="/auth/enter">
                            <a className="font-bold text-blue-600">Sign in.</a>
                        </Link>
                    </p>

                    <div className="flex flex-col space-y-7 py-3">
                        <div className="relative h-[2px] flex justify-center items-center bg-gray-200">
                            <div className="absolute bg-white p-2 font-bold">
                                Or
                            </div>
                        </div>
                        <div className="flex justify-center items-center space-x-5">
                            <div
                                onClick={onKakaoClick}
                                className="relative w-10 aspect-square rounded-full overflow-hidden cursor-pointer shadow-md"
                            >
                                <Image
                                    src="/assets/kakao-icon.png"
                                    layout="fill"
                                    alt="kakao"
                                />
                            </div>
                            <div
                                onClick={onNaverClick}
                                className="relative w-10 aspect-square rounded-full overflow-hidden cursor-pointer shadow-md"
                            >
                                <Image
                                    src="/assets/naver-icon.png"
                                    layout="fill"
                                    alt="naver"
                                />
                            </div>
                            <div
                                onClick={onFacebookClick}
                                className="relative w-10 aspect-square rounded-full overflow-hidden cursor-pointer shadow-md"
                            >
                                <Image
                                    src="/assets/facebook-icon.png"
                                    layout="fill"
                                    alt="facebook"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
