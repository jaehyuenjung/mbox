import useUser, { UserWithAccount } from "@libs/client/useUser";
import type { NextPage } from "next";
import NavBar from "./nav-bar";

export interface BaseProps {
    user: UserWithAccount | undefined;
}

interface LayoutProps {
    FC: React.FC<BaseProps>;
}

const Layout: NextPage<LayoutProps> = ({ FC }) => {
    const { user } = useUser();
    return (
        <div className="flex pt-8 w-screen h-screen">
            <NavBar />
            <FC user={user} />
        </div>
    );
};

export default Layout;
