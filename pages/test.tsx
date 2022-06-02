import Dialog from "@components/dialog";
import Modal1 from "@components/modal";
import { NextPage } from "next";
import { useState } from "react";

const Test: NextPage = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center space-y-8">
            <h1 className="text-lg font-bold">Choose You Want To Do!!!</h1>
            <div className="flex space-x-4">
                <div
                    onClick={() => setOpenDialog(true)}
                    className="px-3 py-2 cursor-pointer bg-slate-400"
                >
                    Dialog Click
                </div>
                <div
                    onClick={() => setOpenModal(true)}
                    className="px-3 py-2 cursor-pointer bg-slate-400"
                >
                    Modal Click
                </div>
            </div>
            <Dialog
                open={openDialog}
                title="title"
                content="content"
                buttons={[
                    {
                        text: "Yes",
                        onCallback: () => console.log("Dialog is Yes Clicked!"),
                    },
                    {
                        text: "No",
                        onCallback: () => {
                            console.log("Dialog is No Clicked!");
                            setOpenDialog(false);
                        },
                    },
                ]}
                onCloseCallback={() => {
                    console.log("Dialog is Clicked!");
                    setOpenDialog(false);
                }}
            />
            <Modal1
                open={openModal}
                title="title"
                onCloseCallback={() => {
                    console.log("Modal is Close Clicked!");
                    setOpenModal(false);
                }}
            >
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sunt cupiditate officiis voluptate placeat suscipit porro
                    animi molestiae atque sint expedita reiciendis, amet fugiat
                    impedit facere pariatur autem nobis provident beatae.
                </div>
            </Modal1>
        </div>
    );
};

export default Test;
