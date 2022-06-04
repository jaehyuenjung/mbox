import React, { useState } from "react";
import Modal1 from "components/modal1";
import { Button, Divider } from "@material-ui/core";
import { BaseProps } from "@components/layout";
interface IAlbum {
  id: number;
  title: string;
  url: string;
}

interface IPerAlbum extends IAlbum {
  key: number;
}
const Example = ({ open, onClose, props }) => {
  const deleteAlbum = () => {
    onClose();
  };
  console.log(props);
  if (!open) return null;
  return (
    <div
      style={{ borderRadius: "12px" }}
      className="text-center bg-white w-1/6 min-w-fit"
    >
      <h1>{props} 앨범을 삭제할까요?</h1>
      <Button
        className="py-2 px-3 w-full "
        color="secondary"
        onClick={deleteAlbum}
      >
        삭제
      </Button>
      <Divider />
      <Button className="py-2 px-3 w-full" onClick={onClose}>
        취소
      </Button>
    </div>
  );
};
export default Example;
