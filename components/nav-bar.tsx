import { Divider } from "@material-ui/core";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import logo from "../public/vercel.svg";
import { BaseProps } from "./layout";
import Modal from "./Modal";
import Profile from "./profile";

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
    <nav className="bg-slate-100 fixed w-full flex justify-between top-0 border-b-2 border-black z-10">
      <Link href="/view">
        <a className="relative left-0 w-10 aspect-square">
          <Image src={logo} className="object-fill" layout="fill" alt="" />
        </a>
      </Link>
      {!isAuthOrOther && (
        <>
          {/* 기능 고민중.. */}
          <input
            type="text"
            placeholder="검색"
            className="mx-auto bg-slate-300 rounded-lg"
          ></input>

          <div className="absolute right-0 w-10 ">
            {/* 현재 페이지 url 복사 */}
            <Link href="/profile">
              <div className="">
                <div className=" max-h-8 relative w-20 aspect-square rounded-full overflow-hidden ">
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
              </div>
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
