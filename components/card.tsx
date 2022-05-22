import { Photo } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";

interface CardProps {
    item?: { id: number; title: string; imagePath: string };
    isPhoto?: boolean;
    onDelete: (id?: number) => void;
    onClick: (id?: number) => void;
}

const Card: NextPage<CardProps> = ({
    item,
    isPhoto = true,
    onDelete,
    onClick,
}) => {
    return (
        <div
            onClick={() => onClick(item?.id)}
            className="w-full cursor-pointer bg-white border-gray-300 rounded-xl border-[1px]"
        >
            <div className="flex flex-col w-full aspect-square">
                <div className="flex justify-between items-center px-2 py-[2px]">
                    <div>{item?.title}</div>
                    {(isPhoto || item?.title !== "1page") && (
                        <svg
                            onClick={() => onDelete(item?.id)}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 bg-gray-100 rounded-full p-1 hover:bg-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {isPhoto ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                />
                            )}
                        </svg>
                    )}
                </div>
                <div className="relative flex-1 border-t-[1px] rounded-xl overflow-hidden">
                    <Image
                        src={item?.imagePath ? item.imagePath : "/noimage.jpg"}
                        className="object-fill"
                        layout="fill"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default Card;
