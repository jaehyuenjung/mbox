import { RefObject, useEffect, useState } from "react";

export default function useCanvasSize(ref: RefObject<HTMLDivElement>) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const setClientPageSize = () => {
            if (ref?.current) {
                const container = ref.current;
                setWidth(container.clientWidth);
                setHeight(container.clientHeight);
            }
        };
        setClientPageSize();

        // window.addEventListener("resize", setClientPageSize);
        return () => {
            // window.removeEventListener("resize", setClientPageSize);
        };
    }, [ref]);

    return { width, height };
}
