import Input from "@components/input";
import SNSIcon from "@components/sns-icon";
import useMutation from "@libs/client/useMutation";
import { ResponseType } from "@libs/server/withHandler";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

        if (!/^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,}$/g.test(name)) {
            errorMessage.push(
                "Name must be at least 2 characters, letters and numbers only."
            );
        } else {
            if (
                !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/g.test(
                    password
                )
            ) {
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

            setValue("password", "");
            setValue("passwordCheck", "");
        } else {
            create({ email, name, password });
        }
    };
    watch(({ password }) => {
        if (password) {
            setStrong(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/g.test(
                    password
                )
            );
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
    if (session) {
        router.replace("/");
    }
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 mx-auto">
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
                        <Input
                            label="Email Address"
                            register={register("email", { required: true })}
                            id="email"
                            type="email"
                        />
                        <Input
                            label="Name"
                            register={register("name", { required: true })}
                            id="name"
                            type="text"
                        />
                        <Input
                            label="Password"
                            register={register("password", { required: true })}
                            id="password"
                            type="password"
                            strong={strong}
                        />
                        <Input
                            label="Password confirmation"
                            register={register("passwordCheck", {
                                required: true,
                            })}
                            id="passwordCheck"
                            type="password"
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
                            <SNSIcon kind="kakao" isSignIn />
                            <SNSIcon kind="naver" isSignIn />
                            <SNSIcon kind="facebook" isSignIn />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
