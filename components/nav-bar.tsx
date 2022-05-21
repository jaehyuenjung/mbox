import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import logo from "../public/favicon/apple-icon-60x60.png";
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

    function copy() {
        setOpen(true);
    }
    return (
        <nav className="fixed w-full flex justify-between items-center left-0 top-0 ">
            <Link href="/view">
                <a className="relative w-10 aspect-square">
                    <Image
                        src={logo}
                        className="object-fill"
                        layout="fill"
                        alt=""
                    />
                </a>
            </Link>

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
