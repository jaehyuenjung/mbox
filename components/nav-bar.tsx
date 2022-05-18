import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import logo from "../public/vercel.svg";

export default function NavBar() {
  const router = useRouter();
  const isAuth = router.pathname.includes("auth");

  // 해당 페이지 url 복사
  const [copied, setCopied] = useState(false);
  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
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
      {!isAuth && (
        <>
          {/* 기능 고민중.. */}
          <input
            type="text"
            placeholder="검색"
            className="text-center mx-auto"
          ></input>

          <div className="absolute right-0">
            {/* 현재 페이지 url 복사 */}
            <button onClick={copy}>{!copied ? "url 복사" : "복사 완료"}</button>

            {/* 앨범 생성 */}
            <button onClick={onCreate}> 앨범 생성</button>
          </div>
        </>
      )}
    </nav>
  );
}