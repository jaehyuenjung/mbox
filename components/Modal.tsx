import { NextPage } from "next";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { cls } from "@libs/client/utils";

interface ModalProps {
    open: boolean;
    title: string;
    big?: boolean;
    onCloseCallback: () => void;
    children: React.ReactNode;
}

const Modal: NextPage<ModalProps> = ({
    open,
    title,
    big = true,
    onCloseCallback,
    children,
}) => {
    if (!open) return null;
    return createPortal(
        <div className="fixed inset-0 z-10 bg-black  bg-opacity-30 backdrop-filter backdrop-blur-md backdrop-grayscale flex justify-center items-center pt-10">
            <div
                onClick={onCloseCallback}
                className="absolute right-4 top-14 cursor-pointer text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cls(
                    "relative h-[70%] px-6 pb-3 flex flex-col items-center justify-center animate-zoomIn bg-white rounded-md min-h-[300px]",
                    big ? "pt-[70px] aspect-video" : "pt-3 aspect-[12/9]"
                )}
            >
                {title && (
                    <div className="absolute w-full flex justify-center py-3 items-center left-0 top-0 px-6 border-b">
                        <h3 className="text-lg font-bold">{title}</h3>
                    </div>
                )}

                {children}
            </motion.div>
        </div>,
        document.body
    );
};

export default Modal;
