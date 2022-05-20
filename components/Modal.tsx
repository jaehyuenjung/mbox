import { NextPage } from "next";
import React from "react";
import ReactDOM from "react-dom";

interface IModal {
    open: boolean;
    children?: React.ReactNode;
    onClose: () => void;
}

const Modal: NextPage<IModal> = ({ open, children, onClose }) => {
    if (!open) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-10 bg-white bg-opacity-50 backdrop-filter backdrop-blur-md backdrop-grayscale">
            <div className="min-h-screen flex flex-col items-center justify-center animate-zoomIn p-12">
                <button onClick={onClose}> close modal</button>
                {children}
            </div>
        </div>,

        document.body
    );
};

export default Modal;
