/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { BaseProps } from "@components/layout";
import { NextPage } from "next";
import { useCallback, useState } from "react";

import dynamic from "next/dynamic";
import Imgaddbtn from "@components/editimgadd";
import { useDropzone } from "react-dropzone";
import { PulseLoader } from "react-spinners";

const Canvas2 = dynamic(() => import("@components/canvas2"), { ssr: false });

const Edit: NextPage<BaseProps> = ({}) => {
  const [imglist, setimglist] = useState([
    {
      id: 1,
      src: "/앨범1.jpg",
      title: "1",
      descript: "흰색",
      width: 100,
      height: 100,
    },
    {
      id: 2,
      src: "/앨범2.jpg",
      title: "2",
      descript: "호색",
      width: 100,
      height: 100,
    },
    {
      id: 3,
      src: "/앨범3.jpg",
      title: "3",
      descript: "보라",
      width: 100,
      height: 100,
    },
    {
      id: 4,
      src: "/images.jpg",
      title: "4",
      descript: "파란거",
      width: 100,
      height: 100,
    },
    {
      id: 5,
      src: "/앨범3.jpg",
      title: "5",
      descript: "보라ㄷ",
      width: 100,
      height: 100,
    },
    {
      id: 6,
      src: "/앨범3.jpg",
      title: "6",
      descript: "보라보라",
      width: 100,
      height: 100,
    },
  ]);
  const [page, setpage] = useState([
    { id: 1, img: imglist, src: "/noimage.jpg" },
  ]);
  const [title, settitle] = useState("사진제목");
  const [descript, setdescript] = useState("사진내용");
  const [img, setimg] = useState("/noimage.jpg");
  const [index, setindex] = useState(0);
  const [pageindex, setpageindex] = useState(0);
  const [id, setid] = useState(7);
  const [pageid, setpageid] = useState(2);
  const [pagelength, setpagelength] = useState(0);
  const [imgwidth, setimgwidth] = useState(0);
  const [imgheight, setimgheight] = useState(0);
  const [imgcheck, setimgcheck] = useState(false);
  const [re, setre] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    setimg(URL.createObjectURL(acceptedFiles[0]));
    setimgcheck(true);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const imgload = (event: any) => {
    if (event.target.files[0] != undefined) {
      setimg(URL.createObjectURL(event.target.files[0]));
    }
  };

  const update_title = (event: any) => {
    settitle(event.target.value);
  };

  const update_descript = (event: any) => {
    setdescript(event.target.value);
  };

  const update_width = (event: any) => {
    setimgwidth(event.target.value);
  };

  const update_height = (event: any) => {
    setimgheight(event.target.value);
  };

  const update_widthheight = (width: number, height: number) => {
    setimgwidth(width);
    setimgheight(height);
  };

  const btnsave = () => {
    imglist[index].title = title;
    imglist[index].descript = descript;
    imglist[index].src = img;
    imglist[index].width = imgwidth;
    imglist[index].height = imgheight;
    settitle("");
    setdescript("");
    if (img !== "/noimage.jpg") {
      setimg("/noimage.jpg");
    }
    setimgcheck(false);
  };

  const addimgbtn = () => {
    setimglist((pre) => [
      ...pre,
      {
        id: id,
        src: "/noimage.jpg",
        title: "사진 제목",
        descript: "사진 내용",
        width: 100,
        height: 100,
      },
    ]);
    setid((id) => id + 1);
  };

  const addpagebtn = () => {
    setpage((pre) => [...pre, { id: pageid, img: [], src: "/noimage.jpg" }]);
    setpageid((pageid) => pageid + 1);
  };

  return (
    <div className={" w-full h-full flex overflow-y-scroll"}>
      <div
        id={"imgscroll"}
        className={
          "min-w-[230px] min-h-[920px] w-[320px] h-full p-2 bg-slate-100 overflow-scroll "
        }
      >
        {imglist.map((val, key) => {
          return (
            <div key={key} className={"relative self-center w-full"}>
              <img
                className={"relative w-full h-[200px] my-2 rounded-xl"}
                src={val.src}
                onClick={() => {
                  setindex(key);
                  settitle(val.title);
                  setdescript(val.descript);
                  setimg(val.src);
                  setimgwidth(val.width);
                  setimgheight(val.height);
                  document.getElementById("imginput").value = "";
                  console.log(val.id);
                  setimgcheck(false);
                }}
              />
              <img
                src="https://img.icons8.com/material-rounded/24/000000/trash.png"
                className={
                  "absolute top-[0px] right-[0px] w-auto h-auto cursor-pointer"
                }
                onClick={(e) => {
                  setimglist(imglist.filter((data) => data.id !== val.id));
                }}
              />
            </div>
          );
        })}
        <Imgaddbtn addimgbtn={addimgbtn} imglist={imglist.length} />
      </div>

      <div
        className={
          " right-0 top-0 w-[80%] h-full bg-slate-600 min-h-[920px] min-w-[780px]"
        }
      >
        <div
          className={
            "flex p-5 flex-col space-y-5 left-0 top-0 w-[96%] h-[96%] bg-slate-200 m-[2%] rounded-3xl"
          }
        >
          <div className={"self-center"}>
            <div className={" w-[600px] h-[400px] bg-zinc-400"}>
              <Canvas2
                img={[img]}
                update_w_h={update_widthheight}
                value={[title, descript]}
              />
            </div>
          </div>
          <div className={"flex flex-row w-[100%] h-[55%]  space-x-1 "}>
            <div
              className={
                "flex flex-col w-full h-[100%] rounded-3xl border-gray-400 border-solid border-[1px] p-3"
              }
            >
              <div
                className={
                  "text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400"
                }
              >
                이미지 업로드
              </div>
              <div
                {...getRootProps()}
                className={
                  "flex flex-col w-full h-full bg-white rounded-md cursor-pointer"
                }
              >
                <input
                  {...getInputProps()}
                  id={"imginput"}
                  type={"file"}
                  onChange={imgload}
                />
                {imgcheck ? (
                  <div className={"w-auto h-auto text-center leading-[300px]"}>
                    <img src={img} />
                  </div>
                ) : isDragActive ? (
                  <div className={"text-center leading-[300px]"}>
                    <PulseLoader color="#8BCB6A" size={20} margin="1px" />
                  </div>
                ) : (
                  <div className={"text-center w-full h-full leading-[300px]"}>
                    <p>이곳에 이미지를 끌어오세요</p>
                  </div>
                )}
              </div>
            </div>
            <div className={"flex flex-col w-full space-y-1"}>
              <div
                className={
                  "flex flex-col w-full h-[37.5%] rounded-3xl border-gray-400 border-solid border-[1px] p-3"
                }
              >
                <div
                  className={
                    "text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400"
                  }
                >
                  제목 입력
                </div>
                <textarea
                  className={"resize-none w-full h-full rounded-md"}
                  onChange={update_title}
                  value={title}
                ></textarea>
              </div>
              <div
                className={
                  "flex flex-col w-full h-[37.5%] rounded-3xl border-gray-400 border-solid border-[1px] p-3"
                }
              >
                <div
                  className={
                    "text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400"
                  }
                >
                  내용 입력
                </div>
                <textarea
                  className={"resize-none w-full h-full rounded-md"}
                  onChange={update_descript}
                  value={descript}
                ></textarea>
              </div>
              <div
                className={
                  "flex flex-row  w-full h-[25%] rounded-3xl border-gray-400 border-solid border-[1px] p-3 space-x-1"
                }
              >
                <div className={"flex flex-col w-[100%]"}>
                  <div
                    className={
                      "text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400"
                    }
                  >
                    가로 길이
                  </div>
                  <input
                    className={"w-auto"}
                    disabled={true}
                    type={"number"}
                    onChange={update_width}
                    value={imgwidth}
                  ></input>
                </div>
                <div className={"flex flex-col w-[100%]"}>
                  <div
                    className={
                      "text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400"
                    }
                  >
                    세로 길이
                  </div>
                  <input
                    className={"w-auto"}
                    disabled={true}
                    type={"number"}
                    onChange={update_height}
                    value={imgheight}
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <button
            className={
              " w-[100%] h-[5%] rounded-3xl text-[20px] font-bold bg-slate-50 border-[1px] border-gray-400 border-solid"
            }
            onClick={btnsave}
          >
            저장
          </button>
        </div>
      </div>

      <div
        id={"pagescroll"}
        className={
          "min-w-[230px] min-h-[920px]  w-[320px] h-full p-2 bg-slate-100 overflow-y-scroll "
        }
      >
        {page.map((val, key) => {
          return (
            <div key={key} className={"relative w-full self-center"}>
              <img
                className={"relative w-full h-[200px] my-2 rounded-xl"}
                src={val.src}
                onClick={() => {
                  if (page[key].img.length == 0) {
                    setid(1);
                  } else {
                    setid(page[key].img[page[key].img.length - 1].id + 1);
                  }
                  if (pagelength <= page.length) {
                    page[pageindex].img = imglist;
                  }
                  setpageindex(key);
                  setimglist(page[key].img);
                }}
              />
              <img
                src="https://img.icons8.com/material-rounded/24/000000/trash.png"
                className={
                  "absolute top-[0px] right-[0px] w-auto h-auto cursor-pointer"
                }
                onClick={(e) => {
                  setpage(page.filter((data) => data.id !== val.id));
                }}
              />
            </div>
          );
        })}
        <button
          className={"w-full h-[200px] my-2 rounded-xl font-bold bg-gray-300"}
          onClick={addpagebtn}
        ></button>
      </div>
    </div>
  );
};

export default Edit;
