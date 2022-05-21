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
          <div className="mx-auto relative  ">
            <div className="absolute mx-40 my-4">
              <svg
                aria-label="검색"
                className="_8-yf5 "
                color="#8e8e8e"
                fill="#8e8e8e"
                height="16"
                role="img"
                viewBox="0 0 24 24"
                width="16"
              >
                <path
                  d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  x1="16.511"
                  x2="22"
                  y1="16.511"
                  y2="22"
                ></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="검색"
              className="w-full my-3  focus:outline-none bg-slate-300 rounded-lg"
            ></input>
          </div>
          <div className="absolute right-0 w-10 ">
            {/* 현재 페이지 url 복사 */}
            <Link href="/profile">
              <div className="">
                <div className=" max-h-8 relative w-20 my-2 aspect-square rounded-full overflow-hidden ">
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
