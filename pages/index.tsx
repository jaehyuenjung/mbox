import useUser from "@libs/client/useUser";
import type { NextPage } from "next";

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
    const { user } = useUser();
    return null;
};

export default Home;
