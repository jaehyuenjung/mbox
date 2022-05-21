import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import logo from "../public/vercel.svg";
import { BaseProps } from "./layout";
import Modal from "./modal";

const NavBar: NextPage<BaseProps> = ({ user }) => {
    const router = useRouter();
    const isAuthOrOther =
        router.pathname.includes("auth") || router.pathname.includes("other");
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState(0);

    useEffect(() => {
        if (window) {
            const onResize = () => {
                if (document) {
                    const minLength = Math.min(
                        document.body.clientWidth,
                        document.body.clientHeight
                    );
                    setSize(minLength * 0.3);
                }
            };

            onResize();

            window.addEventListener("resize", onResize);
            return () => {
                window.removeEventListener("resize", onResize);
            };
        }
    }, []);

    // 해당 페이지 url 복사
    const [copied, setCopied] = useState(false);
    function copy() {
        setOpen(true);
    }
    //앨범 생성
    const onCreate = () => {};
    return (
        <nav className="fixed w-full flex justify-between top-0">
            <Link href="/view">
                <a className="absolute left-0 w-10 aspect-square">
                    <Image
                        src={logo}
                        className="object-fill"
                        layout="fill"
                        alt=""
                    />
                </a>
            </Link>
            {!isAuthOrOther && (
                <>
                    {/* 기능 고민중.. */}
                    <input
                        type="text"
                        placeholder="검색"
                        className="mx-auto"
                    ></input>

                    <div className="absolute right-0">
                        {/* 현재 페이지 url 복사 */}
                        <button onClick={copy}>
                            {!copied ? "url 복사" : "복사 완료"}
                        </button>

                        {/* 앨범 생성 */}
                        <button onClick={onCreate}> 앨범 생성</button>
                    </div>
                </>
            )}
            <Modal open={open} onClose={() => setOpen(false)}>
                <QRCodeCanvas
                    id="qrCode"
                    value="https://reactjs.org/"
                    size={size}
                />
                <div className="flex justify-center items-center space-x-3 mt-3">
                    <div
                        onClick={() => {
                            const qrCode = document.getElementById(
                                "qrCode"
                            ) as HTMLCanvasElement;
                            if (qrCode) {
                                qrCode.toBlob(async (blob) => {
                                    if (blob) {
                                        try {
                                            await navigator.clipboard.write([
                                                new ClipboardItem({
                                                    [blob.type]: blob,
                                                }),
                                            ]);

                                            alert("Copy Succes!");
                                        } catch {
                                            alert("Copy Fail!");
                                        }
                                    } else alert("Copy Fail!");
                                });
                            } else alert("Copy Fail!");
                        }}
                        className="px-3 py-2 bg-gray-500 rounded-md cursor-pointer"
                    >
                        QR CODE COPY
                    </div>
                    <div
                        onClick={async () => {
                            try {
                                await navigator.clipboard.writeText(
                                    "https://reactjs.org/"
                                );
                                alert("Copy Succes!");
                            } catch {
                                alert("Copy Fail!");
                            }
                        }}
                        className="px-3 py-2 bg-gray-500 rounded-md cursor-pointer"
                    >
                        URL COPY
                    </div>
                </div>
            </Modal>
        </nav>
    );
};

export default NavBar;
