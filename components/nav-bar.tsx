import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import logo from "../public/vercel.svg";
import { BaseProps } from "./layout";
import Modal from "./Modal";

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
          <Image src={logo} className="object-fill" layout="fill" alt="" />
        </a>
      </Link>
      {!isAuthOrOther && (
        <>
          {/* 기능 고민중.. */}
          <input type="text" placeholder="검색" className="mx-auto"></input>

          <div className="absolute right-0">
            {/* 현재 페이지 url 복사 */}
            <button onClick={copy}> 프로필 보기</button>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
