import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Dialog, Zoom, Button, Divider } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { withPreviews, clearPreviews } from "./with-previews";

interface IModal {
  open: boolean;
  onClose: () => void;
}

const enterPost = () => {};
const modifyPost = () => {};
const deletePost = () => {};

const Modal: NextPage<IModal> = ({ open, onClose }) => {
  const [files, setFiles] = useState([]);
  useEffect(() => () => clearPreviews(files), [files]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
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
    clearPreviews(files);
    setFiles([]);
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
              <Divider />

              <div
                className=" w-full h-full bg-white  inline-flex"
                style={{
                  borderBottomRightRadius: "12px",
                  borderBottomLeftRadius: "12px",
                }}
              >
                <div className="flex items-center justify-center"></div>
                <div
                  {...getRootProps({
                    className:
                      "flex items-center justify-center dropzone w-3/5 h-full overflow-hidden",
                  })}
                >
                  <div>
                    {Array.isArray(files) && files.length === 0 ? (
                      <div>
                        <svg
                          aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                          color="#262626"
                          fill="#262626"
                          height="77"
                          role="img"
                          viewBox="0 0 97.6 77.3"
                          width="96"
                        >
                          <path
                            d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                            fill="currentColor"
                          ></path>
                        </svg>

                        <div className="select-none">사진을 넣어주세요</div>
                      </div>
                    ) : (
                      { thumbs }
                    )}
                  </div>

                  <input {...getInputProps()} />
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
