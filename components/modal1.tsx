import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface IModal {
  open: boolean;
  onClose: () => void;
  children: any;
}

const Modal1: NextPage<IModal> = ({ open, onClose, children }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className="absolute flex h-screen justify-center items-center inset-0 z-10 bg-black bg-opacity-50 backdrop-filter  ">
        {children}
      </div>

      <div className="absolute right-0 top-0 m-2 z-40">
        <button onClick={onClose}>
          <svg
            aria-label="닫기"
            className="_8-yf5 "
            color="#fff"
            fill="#fff"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
            ></polyline>
            <line
              fill="none"
              stroke="currentColor"
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            ></line>
          </svg>
        </button>
      </div>
    </>,
    document.body
  );
};
export default Modal1;
