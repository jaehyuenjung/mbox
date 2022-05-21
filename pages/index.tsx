import { AnimatePresence, MotionConfig } from "framer-motion";
import { NextPage, NextPageContext } from "next";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { cls } from "@libs/client/utils";
import AnimationText from "@components/animation-text";
import Link from "next/link";
import Modal from "@components/Modal";
import { SWRConfig } from "swr";
import client from "libs/server/client";
import { getSession } from "next-auth/react";
import { Album } from "@prisma/client";
import CreateAlbum from "components/create-album";
import { Card } from "@material-ui/core";
import { BaseProps } from "@components/layout";

interface IAlbum {
  id: number;
  title: string;
  url: string;
}

interface IPerAlbum extends IAlbum {
  key: number;
}

const infoWrapperVariants = {
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 2 },
  },
};

const infoColVariants = {
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Home: NextPage<BaseProps> = ({ user }) => {
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
  const [delay, setDelay] = useState(false);

  const [isopen, setIsOpen] = useState(false);
  const [isopen1, setIsOpen1] = useState(false);

  const page = Math.min(albums.length - 1, 6);
  const perAlbums: IPerAlbum[] = [];

  // 앨범 삭제 기능
  const onRemove = () => {
    setAlbums(albums.filter((album) => album.id !== perAlbums[index].id));
  };

  if (page) {
    for (let i = 0; i < page; i++) {
      perAlbums.push({
        ...albums[(index + i) % albums.length],
        key: (perIndex + i) % (page * 2 + 1),
      });
    }
  }

  return (
    <div
      // onClick={onClick}
      className="relative py-4 mx-auto w-full max-w-6xl h-full overflow-hidden bg-gray-800"
    >
      <div
        style={{ gridTemplateColumns: "2fr 1fr" }}
        className="h-full grid grid-cols items-center mr-16"
      >
        <div
          style={{
            perspective: "250px",
            transformStyle: "preserve-3d",
          }}
          className="w-full h-full transform-gpu flex justify-end"
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(10deg) scaleY(1.2)",
            }}
            className="relative w-full h-full flex justify-center items-center"
          >
            <AnimatePresence
              onExitComplete={() => {
                setDelay(false);
              }}
            >
              {perAlbums.map((album, i) => (
                <motion.div
                  key={album.key}
                  exit={{
                    opacity: 0,
                    x: 200,
                    z: 200,
                  }}
                  initial={{
                    x: -i * 60,
                    z: -i * 60,
                    filter: `blur(${i * 0.5}px)`,
                  }}
                  animate={{
                    x: 60 - i * 60,
                    z: 60 - i * 60,
                    filter: `blur(${i * 0.5}px)`,
                  }}
                  transition={{
                    default: { duration: 1.5 }, // 1.5
                  }}
                  className="absolute w-2/4 aspect-video"
                >
                  <div className="relative w-full h-full">
                    <motion.div className="absolute w-full h-full bg-white rounded-md" />
                    <motion.div
                      style={{
                        maskImage:
                          i == 0 ? "url(assets/sprites/slider-sprite.png)" : "",
                        WebkitMaskImage:
                          i == 0 ? "url(assets/sprites/slider-sprite.png)" : "",
                        maskSize: "3000% 100%",
                        WebkitMaskSize: "3000% 100%",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: i === 0 ? 1 : 0,
                        transition: {
                          delay: 1,
                          duration: 1.5, // 1.5,
                        },
                      }}
                      className={cls(
                        "relative w-full h-full rounded-md",
                        i === 0 ? "slider" : ""
                      )}
                    >
                      <Image src={album.url} layout="fill" alt="" />
                    </motion.div>
                  </div>
                  <div className="absolute w-full h-1/2 top-[102%] overflow-hidden">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: i === 0 ? 0 : 1,
                        transition: { duration: 2 },
                      }}
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(255,255,255,0.2) 1%, rgba(31, 41, 55, 1) 40%, rgba(31, 41, 55, 1) 100%)",
                      }}
                      className="absolute w-full h-[200%] rounded-md"
                    />
                    <motion.div
                      style={{
                        maskImage:
                          i == 0 ? "url(assets/sprites/slider-sprite.png)" : "",
                        WebkitMaskImage:
                          i == 0 ? "url(assets/sprites/slider-sprite.png)" : "",

                        maskSize: "3000% 100%",
                        WebkitMaskSize: "3000% 100%",
                        transform: "rotateX(180deg)",
                        backgroundImage: `url(${album.url})`,
                        backgroundSize: "100% 100%",
                      }}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: i === 0 ? 0.5 : 0,

                        transition: {
                          delay: 1,
                          duration: 1.5,
                        },
                      }}
                      className={cls(
                        "relative w-full bg-center bg-no-repeat bg-cover h-[200%] rounded-md",
                        i === 0 ? "slider" : ""
                      )}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(to top, transparent 1%, rgba(31, 41, 55, 1) 40%, rgba(31, 41, 55, 1) 100%) ",
                        }}
                        className="w-full h-full"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div key={index}>
          <div>
            <div className="w-full flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                <AnimationText
                  staggerTime={0.1}
                  text="Title"
                  kind="fading"
                  className="text-white"
                />
              </h2>
              {/* 수정 삭제로 들어가는 모달 */}
              <Modal open={isopen} onClose={() => setIsOpen(false)}></Modal>

              <motion.div
                variants={infoColVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 3 }}
                onClick={() => setIsOpen(true)}
                className="cursor-pointer"
              >
                <div>
                  <svg
                    aria-label="옵션 더 보기"
                    className="_8-yf5 "
                    color="#fff"
                    fill="#fff"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6" cy="12" r="1.5"></circle>
                    <circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                </div>
              </motion.div>
            </div>
            <AnimatePresence>
              <motion.div
                className="w-full space-y-4"
                initial="hidden"
                animate="visible"
                variants={infoWrapperVariants}
              >
                <MotionConfig
                  transition={{
                    default: {
                      ease: "easeInOut",
                      duration: 0.5,
                    },
                  }}
                >
                  <motion.div
                    className="w-full flex space-x-2 text-gray-500"
                    variants={infoColVariants}
                  >
                    <div className="whitespace-nowrap">
                      {new Date().toDateString()}
                    </div>
                    <span>/</span>
                    <div>#태그 #태그 #태그</div>
                  </motion.div>

                  <motion.textarea
                    readOnly
                    className="w-full h-36 text-white bg-transparent resize-none overflow-hidden focus:overflow-auto focus:outline-none"
                    variants={infoColVariants}
                    value="Lorem ipsum dolor sit amet
                                                consectetur adipisicing elit.
                                                Dignissimos optio fugiat reiciendis
                                                quam. Error debitis qui numquam
                                                ducimus corporis nihil distinctio
                                                necessitatibus iste aperiam? Minus
                                                exercitationem distinctio natus
                                                excepturi autem."
                  ></motion.textarea>
                  <motion.div
                    className="w-full items-center text-center"
                    variants={infoColVariants}
                  >
                    <Link href={"inneredit"}>
                      <button className="bg-gray-300 hover:bg-gray-400 text-gray-800  font-bold py-2 px-4 rounded-full">
                        앨범 내부 편집
                      </button>
                    </Link>
                  </motion.div>
                </MotionConfig>
              </motion.div>
            </AnimatePresence>
          </div>

          <CreateAlbum
            open={isopen1}
            onClose={() => setIsOpen1(false)}
          ></CreateAlbum>

          <motion.div
            onClick={() => setIsOpen1(true)}
            variants={infoColVariants}
            transition={{ delay: 3 }}
            initial="hidden"
            animate="visible"
            className="absolute right-4 bottom-4 text-slate-100 cursor-pointer"
          >
            <div>
              <svg
                aria-label="새로운 게시물"
                color="#ddd"
                fill="#ddd"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
                  fill="none"
                  stroke="currentColor"
                ></path>
                <line
                  fill="none"
                  stroke="currentColor"
                  x1="6.545"
                  x2="17.455"
                  y1="12.001"
                  y2="12.001"
                ></line>
                <line
                  fill="none"
                  stroke="currentColor"
                  x1="12.003"
                  x2="12.003"
                  y1="6.545"
                  y2="17.455"
                ></line>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="absolute bottom-0"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2 }}
      >
        <ul className="flex justify-between space-x-4 py-2 mx-4">
          {albums.map((album, i) => (
            <li
              key={i}
              className="relative text-white"
              onClick={() => {
                if (!delay) {
                  const gap = (albums.length - (index - i)) % albums.length;
                  setIndex(i);
                  if (gap <= 6)
                    setPerIndex((prev) => (prev + gap) % (page * 2 + 1));
                  else setPerIndex((prev) => (prev + 6) % (page * 2 + 1));
                  setDelay(true);
                }
              }}
            >
              <h4>{album.title}</h4>
              {i == index && (
                <motion.div
                  layoutId={"underline"}
                  className="w-full h-1 absolute -bottom-[2px] bg-red-400 rounded-md"
                />
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
interface IPageProps {
  albums: Album[];
}

const Page: NextPage<IPageProps> = ({ albums }) => {
  return (
    <SWRConfig
      value={{
        fallback: { "/api/albums/me": { ok: true, albums } },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

// export async function getServerSideProps({ req }: NextPageContext) {
//     const session = await getSession({ req });
//     if (session) {
//         const albums = await client.album.findMany({
//             where: { userId: session.user.id },
//         });
//         return { props: { albums: JSON.parse(JSON.stringify(albums)) } };
//     }
//     return {
//         redirect: {
//             permanent: false,
//             destination: "/auth/enter",
//         },
//         props: {},
//     };
// }
export default Home;
