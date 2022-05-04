import { BaseProps } from "@components/layout";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@components/canvas"), { ssr: false });

const Map: NextPage<BaseProps> = ({}) => {
    return <Canvas />;
};

export default Map;
