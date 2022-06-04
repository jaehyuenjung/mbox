import React, { useState } from "react";
import Modal1 from "@components/modal1";
import Example from "@components/exammodal";
import { NextPage } from "next";
import { Button, Divider } from "@material-ui/core";
import { BaseProps } from "@components/layout";
import Qrmodal from "@components/qrmodal";
import EditModal from "@components/exameditmodal";
interface IAlbum {
  id: number;
  title: string;
  url: string;
}

interface IPerAlbum extends IAlbum {
  key: number;
}
const Exam: NextPage<IAlbum> = ({}) => {
  const [albums, setAlbums] = useState([
    { id: 1000, title: "elephant", url: "/assets/elephant-hd-quality.png" },
    {
      id: 1001,
      title: "lighthouse",
      url: "https://cdn.pixabay.com/photo/2017/06/04/23/17/lighthouse-2372461__340.jpg",
    },
    {
      id: 1002,
      title: "planet",
      url: "https://cdn.pixabay.com/photo/2016/09/29/13/08/planet-1702788__340.jpg",
    },
    {
      id: 1003,
      title: "water",
      url: "https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252__340.jpg",
    },
    {
      id: 1004,
      title: "sunset",
      url: "https://cdn.pixabay.com/photo/2018/09/19/23/03/sunset-3689760__340.jpg",
    },
    {
      id: 1005,
      title: "sunset01",
      url: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    },
    {
      id: 1006,
      title: "sunset02",
      url: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    },
    {
      id: 1007,
      title: "sunset03",
      url: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg",
    },
  ]);
  const [index, setIndex] = useState(0);
  const [perIndex, setPerIndex] = useState(0);

  const page = Math.min(albums.length - 1, 6);
  const perAlbums: IPerAlbum[] = [];
  if (page) {
    for (let i = 0; i < page; i++) {
      perAlbums.push({
        ...albums[(index + i) % albums.length],
        key: (perIndex + i) % (page * 2 + 1),
      });
    }
  }
  const [isopen, setIsOpen] = useState(false);
  const [isopen1, setIsOpen1] = useState(false);
  const [isopen2, setIsOpen2] = useState(false);
  const [isopen3, setIsOpen3] = useState(false);

  const openDelete = () => {
    setIsOpen1(true);
    setIsOpen(false);
  };
  const openModify = () => {
    setIsOpen3(true);
    setIsOpen(false);
  };
  const openQr = () => {
    setIsOpen2(true);
    setIsOpen(false);
  };

  return (
    <>
      <>
        {albums.map((album, i) => (
          <div key={i} className="flex text-center self-center">
            {album.title}
            <button
              key={i}
              onClick={(key) => {
                setIsOpen(true);
                setIndex(i);
              }}
            >
              hello
            </button>
            &nbsp;&nbsp;
          </div>
        ))}

        <Modal1 open={isopen} onClose={() => setIsOpen(false)}>
          <div
            style={{ borderRadius: "12px" }}
            className="text-center bg-white w-2/6 min-w-fit"
          >
            <Divider />
            <Button className="py-2 px-3 w-full" onClick={openQr}>
              qr코드/url 복사
            </Button>
            <Divider />
            <Button className="py-2 px-3 w-full" onClick={openModify}>
              {albums[index].title}수정
            </Button>
            <Divider />
            <Button
              className="py-2 px-3 w-full"
              color="secondary"
              onClick={openDelete}
            >
              삭제
            </Button>

            <Divider />
            <Button
              className="py-2 px-3 w-full"
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
          </div>
        </Modal1>

        {/* qr코드/url 복사 */}
        <Modal1 open={isopen2} onClose={() => setIsOpen2(false)}>
          <Qrmodal
            props={albums}
            open={isopen2}
            onClose={() => setIsOpen2(false)}
          />
        </Modal1>
        {/* 수정 */}
        <Modal1 open={isopen3} onClose={() => setIsOpen3(false)}>
          <EditModal
            props={albums[index]}
            open={isopen3}
            onClose={() => setIsOpen3(false)}
          />
        </Modal1>
        {/* 삭제 */}
        <Modal1 open={isopen1} onClose={() => setIsOpen1(false)}>
          <Example
            props={albums[index].title}
            open={isopen1}
            onClose={() => setIsOpen1(false)}
          />
        </Modal1>
      </>
    </>
  );
};
export default Exam;
