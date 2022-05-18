import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Dialog, Zoom, Button, Divider } from "@material-ui/core";
import { useDropzone } from "react-dropzone";

interface IModal {
  open: boolean;
  onClose: () => void;
}

const enterPost = () => {};
const modifyPost = () => {};
const deletePost = () => {};

const Modal: NextPage<IModal> = ({ open, onClose }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  const thumbs = files.map((file, index) => (
    <div className="w-full h-full" key={file.name}>
      <img
        className="w-full h-full object-cover"
        style={{ borderBottomLeftRadius: "12px" }}
        src={file.preview}
        alt=""
      />
    </div>
  ));
  useEffect(
    () => () => {
      // Make sure to revoke the Object URL to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const [delete1, setDelete1] = useState(false);
  const deletePost1 = () => {
    setDelete1(false);
  };
  const deletePost2 = () => {
    setDelete1(false);
    onClose;
  };
  const [modify1, setModify1] = useState(false);
  const modifyPost1 = () => {
    setModify1(false);
  };
  const modifyPost2 = () => {
    setModify1(false);
  };
  if (!open) return null;

  // 수정 모달
  if (modify1)
    return ReactDOM.createPortal(
      <>
        <div className="absolute flex h-screen justify-center items-center inset-0 z-10 bg-black bg-opacity-50 backdrop-filter  ">
          <div className="min-h-fit h-full px-6 w-full min-w-fit  flex flex-col items-center justify-center animate-zoomIn ">
            <div
              style={{ borderRadius: "12px" }}
              className="text-center bg-white w-2/3 h-2/3 max-w-3xl "
            >
              <div className="flex justify-between">
                <Button className="py-2 px-3 float-left" onClick={modifyPost2}>
                  취소
                </Button>
                <div className="py-2 px-3 text-center">앨범 정보 수정</div>
                <Button className="py-2 px-3 float-right" onClick={modifyPost2}>
                  적용
                </Button>
              </div>
              <div
                className=" w-full h-full  bg-white  inline-flex"
                style={{
                  borderBottomRightRadius: "12px",
                  borderBottomLeftRadius: "12px",
                }}
              >
                <div
                  {...getRootProps({
                    className: "dropzone w-3/5 h-full overflow-hidden",
                  })}
                >
                  <input {...getInputProps()} />
                  {thumbs}
                </div>
                <div className="w-2/5 ">
                  <input className=" h-5/6 w-full" placeholder="제목"></input>
                  <input
                    className="h-1/6 w-full"
                    style={{ borderBottomRightRadius: "12px" }}
                    placeholder="설명"
                  ></input>
                </div>
              </div>
              <Divider />
            </div>
          </div>
        </div>
      </>,
      document.body
    );

  //삭제 모달
  if (delete1)
    return ReactDOM.createPortal(
      <>
        <div className="absolute flex h-screen justify-center items-center inset-0 z-10 bg-black bg-opacity-50 backdrop-filter  ">
          <div className="min-h-screen px-6 w-2/3 max-w-md  flex flex-col items-center justify-center animate-zoomIn ">
            <div
              style={{ borderRadius: "12px" }}
              className="text-center bg-white w-full "
            >
              <h1>해당 앨범을 삭제할까요?</h1>
              <Button className="py-2 px-3 w-full" onClick={deletePost1}>
                삭제
              </Button>
              <Divider />
              <Button className="py-2 px-3 w-full" onClick={deletePost2}>
                취소
              </Button>
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  return ReactDOM.createPortal(
    <>
      <div className="absolute flex h-screen justify-center items-center inset-0 z-10 bg-black bg-opacity-50 backdrop-filter  ">
        <div className="min-h-screen px-6 w-2/3 max-w-md  flex flex-col items-center justify-center animate-zoomIn ">
          <div
            style={{ borderRadius: "12px" }}
            className="text-center bg-white w-full "
          >
            <Button className="py-2 px-3 w-full" onClick={enterPost}>
              게시물 들어가기
            </Button>
            <Divider />
            <Button
              className="py-2 px-3 w-full"
              onClick={() => setModify1(true)}
            >
              수정
            </Button>
            <Divider />
            <Button
              className="py-2 px-3 w-full"
              onClick={() => setDelete1(true)}
            >
              삭제
            </Button>
            <Divider />
            <Button className="py-2 px-3 w-full" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
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

export default Modal;
