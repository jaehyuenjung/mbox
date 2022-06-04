import React, { useEffect, useState } from "react";
import Modal1 from "components/modal1";
import { Button, Divider } from "@material-ui/core";
import { BaseProps } from "@components/layout";
import { QRCodeCanvas } from "qrcode.react";

const Qrmodal = ({ open, onClose, props }) => {
  const [size, setSize] = useState(0);
  useEffect(() => {
    if (window) {
      const onResize = () => {
        if (document) {
          const minLength = Math.min(
            document.body.clientWidth,
            document.body.clientHeight
          );
          setSize(minLength * 0.3);
        }
      };

      onResize();

      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, []);
  if (!open) return null;
  return (
    <div
      style={{ borderRadius: "12px" }}
      className="text-center bg-white w-1/6 min-w-fit"
    >
      <div className="text-center">
        <QRCodeCanvas
          id="qrCode"
          value="https://reactjs.org/"
          size={size}
          className="inline-block"
        />
      </div>
      <div className="w-full ">
        <Button
          onClick={() => {
            const qrCode = document.getElementById(
              "qrCode"
            ) as HTMLCanvasElement;
            if (qrCode) {
              qrCode.toBlob(async (blob) => {
                if (blob) {
                  try {
                    await navigator.clipboard.write([
                      new ClipboardItem({
                        [blob.type]: blob,
                      }),
                    ]);

                    alert("Copy Succes!");
                  } catch {
                    alert("Copy Fail!");
                  }
                } else alert("Copy Fail!");
              });
            } else alert("Copy Fail!");
          }}
          className="py-2 px-3 w-full"
        >
          QR CODE COPY
        </Button>
        <Divider />
        <Button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText("https://reactjs.org/");
              alert("Copy Succes!");
            } catch {
              alert("Copy Fail!");
            }
          }}
          className="py-2 px-3 w-full"
        >
          URL COPY
        </Button>
        <Divider />
        <Button className="py-2 px-3 w-full" onClick={onClose}>
          취소
        </Button>
      </div>
    </div>
  );
};
export default Qrmodal;
