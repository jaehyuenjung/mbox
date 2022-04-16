import { BaseProps } from "@components/layout";
import { cls, getProviderColor } from "@libs/client/utils";
import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import SNSIcon from "@components/sns-icon";

const Home: NextPage<BaseProps> = ({ user }) => {
    const [open, setOpen] = useState<boolean>(false);
    const description = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
    Ipsa nobis earum recusandae vero obcaecati atque. Ipsum,
    officia hic reiciendis natus numquam, quidem voluptates
    velit unde obcaecati possimus inventore repellat amet!`;

    const isOverflow = description.length > 150;

    const onClick = () => {
        if (isOverflow) {
            setOpen((prev) => !prev);
        }
    };

    const onSignOut = async () => {
        await signOut();
    };

    return (
        <>
            <div className="flex items-start pl-3 flex-wrap space-x-3 will-change-contents select-none">
                <motion.div
                    layout
                    transition={{ type: "spring" }}
                    className="max-w-sm flex flex-col shadow-md px-8 space-y-3 py-3"
                >
                    <div className="font-bold text-lg">Profile</div>
                    <div
                        className={cls(
                            user ? "" : "blur-sm",
                            "flex  flex-col space-y-4"
                        )}
                    >
                        <div className="flex items-center space-x-12">
                            <div className="relative w-20 aspect-square rounded-full overflow-hidden ">
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        className="object-fill"
                                        layout="fill"
                                        alt="avatar"
                                    />
                                ) : (
                                    <div className="h-full rounded-full bg-gray-300" />
                                )}
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="text-lg leading-none">
                                    {user?.name ? user.name : "unknown"}
                                </div>
                                <div className="leading-none flex items-center text-xs text-gray-500 mt-1">
                                    <div
                                        className={cls(
                                            "w-3 aspect-square rounded-full tool",
                                            getProviderColor(
                                                user?.accounts[0]?.provider
                                            )
                                        )}
                                    ></div>
                                    <span className="pl-2">
                                        {user?.email ? user.email : "unknown"}
                                    </span>
                                </div>
                                <div className="leading-none bg-blue-400 px-6 py-2 rounded-md cursor-pointer mt-4 mb-auto text-white">
                                    Flow
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-around">
                            <div className="flex flex-col justify-center items-center text-center font-bold ">
                                <span className="text-sm">TWEETS</span>
                                <span className="text-sm">{1}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center text-center font-bold ">
                                <span className="text-sm">FOLLOWERS</span>
                                <span className="text-sm">{1}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center text-center font-bold ">
                                <span className="text-sm">FOLLOWING</span>
                                <span className="text-sm">{1}</span>
                            </div>
                        </div>
                        <div>
                            <p className="leading-none text-sm">
                                {isOverflow
                                    ? open
                                        ? description
                                        : description.slice(0, 150) + "..."
                                    : description}
                            </p>
                            {isOverflow ? (
                                <div
                                    onClick={onClick}
                                    className="relative bg-gray-800 text-white text-center rounded-md mt-1 cursor-pointer"
                                >
                                    {open ? "Close" : "Open"}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-md flex flex-col justify-center items-start shadow-md px-8 space-y-3 py-3 ">
                    <div className="font-bold text-lg">Profile Detail</div>
                    <div
                        className={cls(
                            user ? "" : "blur-sm",
                            "flex flex-col justify-center items-start space-y-8"
                        )}
                    >
                        <div className="flex items-center space-x-12">
                            <div className="relative w-20 aspect-square rounded-full overflow-hidden ">
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        className="object-fill"
                                        layout="fill"
                                        alt="avatar"
                                    />
                                ) : (
                                    <div className="h-full rounded-full bg-gray-300" />
                                )}
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center text-lg leading-none">
                                    <span>
                                        {user?.name ? user.name : "unknown"}
                                    </span>
                                    <div className="ml-28 bg-blue-400 p-3 rounded-md text-white cursor-pointer">
                                        Edit
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-around">
                            <div className="flex flex-col justify-center items-center text-center font-bold ">
                                <span className="text-sm">TWEETS</span>
                                <span className="text-sm">{1}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center text-center font-bold ">
                                <span className="text-sm">FOLLOWERS</span>
                                <span className="text-sm">{1}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center text-center font-bold ">
                                <span className="text-sm">FOLLOWING</span>
                                <span className="text-sm">{1}</span>
                            </div>
                        </div>
                        <div>
                            <p className="leading-none text-sm">
                                {description}
                            </p>
                        </div>
                        <div className="justify-start">
                            <div className="flex items-center">
                                <SNSIcon kind={user?.accounts[0]?.provider} />
                                <span className="pl-3 text-lg font-semibold">
                                    {user?.accounts[0]
                                        ? user.accounts[0].provider
                                        : "mbox"}{" "}
                                    아이디 계정 회원
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                {user?.email ? user.email : "unkown"}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onSignOut}
                        className="p-1 bg-blue-400 rounded-md mx-auto text-white"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
