import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface SNSIconProps {
    kind: "kakao" | "naver" | "facebook";
}

const SNSIcon: NextPage<SNSIconProps> = ({ kind }) => {
    const onClick = async () => {
        await signIn(kind, {
            redirect: false,
            callbackUrl: `${window.location.origin}/`,
        });
    };
    return (
        <>
            <div
                onClick={onClick}
                className="relative w-10 aspect-square rounded-full overflow-hidden cursor-pointer shadow-md"
            >
                <Image
                    src={`/assets/${kind}-icon.png`}
                    layout="fill"
                    alt={kind}
                />
            </div>
        </>
    );
};

export default SNSIcon;
