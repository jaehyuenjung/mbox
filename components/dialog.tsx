import { NextPage } from "next";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { cls } from "@libs/client/utils";

interface DialogBtn {
    text: string;
    onCallback: () => void;
}

interface DialogProps {
    open: boolean;
    title?: string;
    content?: string;
    buttons: DialogBtn[];
    onCloseCallback: () => void;
}

const Dialog: NextPage<DialogProps> = ({
    open,
    title,
    content,
    buttons,
    onCloseCallback,
}) => {
    if (!open) return null;

    const headerForm = title || content;
    return createPortal(
        <div
            onClick={onCloseCallback}
            className="fixed inset-0 z-10 bg-black bg-opacity-30 backdrop-filter backdrop-blur-md backdrop-grayscale flex justify-center items-center"
        >
            <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-1/4 flex flex-col  justify-center animate-zoomIn rounded-md overflow-hidden bg-white"
            >
                {headerForm && (
                    <div className="flex flex-col justify-center items-center space-y-1 py-4">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <div className="text-[#8E8E8E]">{content}</div>
                    </div>
                )}

                <div
                    onClick={(event) => event.stopPropagation()}
                    className={cls(
                        "flex flex-col bg-[#DBDBDB] justify-center items-center gap-[1px]",
                        headerForm ? "border-t" : ""
                    )}
                >
                    {buttons.map((button, i) => (
                        <div
                            key={i}
                            onClick={button.onCallback}
                            className="w-full py-2 bg-white cursor-pointer text-center"
                        >
                            {button.text}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default Dialog;
