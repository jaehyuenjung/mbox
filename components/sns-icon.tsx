import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import kakao from "../public/assets/kakao-icon.png";
import naver from "../public/assets/naver-icon.png";
import facebook from "../public/assets/facebook-icon.png";
import { cls } from "@libs/client/utils";

interface SNSIconProps {
    kind: "kakao" | "naver" | "facebook" | string | undefined;
    isSignIn?: boolean;
}

const SNSIcon: NextPage<SNSIconProps> = ({ kind, isSignIn = false }) => {
    const onClick = () => {
        signOut({ redirect: false }).then(() => {
            signIn(kind, {
                redirect: false,
                callbackUrl: `${window.location.origin}/`,
            });
        });
    };
    return (
        <>
            <div
                onClick={isSignIn ? onClick : undefined}
                className={cls(
                    "relative w-10 aspect-square rounded-full overflow-hidden shadow-md",
                    isSignIn ? "cursor-pointer" : ""
                )}
            >
                {kind ? (
                    <Image
                        src={
                            kind === "kakao"
                                ? kakao
                                : kind === "naver"
                                ? naver
                                : facebook
                        }
                        className="object-fill"
                        layout="fill"
                        alt={kind}
                        placeholder="blur"
                    />
                ) : (
                    <div className="h-full rounded-full bg-gray-300" />
                )}
            </div>
        </>
    );
};

export default SNSIcon;
