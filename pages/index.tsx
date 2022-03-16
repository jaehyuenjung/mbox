import useUser from "@libs/client/useUser";
import type { NextPage } from "next";
import { signOut } from "next-auth/react";

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
    const { user } = useUser();

    const onClick = async () => {
        await signOut();
    };
    return (
        <>
            <div>{user?.id}</div>
            <button
                onClick={onClick}
                className="p-1 border-2 border-blue-500 rounded-md"
            >
                Sign Out
            </button>
        </>
    );
};

export default Home;
