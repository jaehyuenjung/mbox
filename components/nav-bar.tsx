import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import logo from "../public/favicon/apple-icon-60x60.png";
import { BaseProps } from "./layout";

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
        <nav className="fixed w-full flex justify-between items-center left-0 top-0 z-50 bg-white">
            <Link href="/">
                <a className="relative w-10 aspect-square">
                    <Image
                        src={logo}
                        className="object-fill"
                        layout="fill"
                        alt=""
                    />
                </a>
            </Link>
        </nav>
    );
};

export default NavBar;
