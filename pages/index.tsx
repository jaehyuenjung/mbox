import useUser from "@libs/client/useUser";
import type { NextPage } from "next";

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
    const { user } = useUser();

    return <div>{user?.id}</div>;
};

export default Home;
