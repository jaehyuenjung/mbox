import { ResponseType } from "@libs/server/withHandler";
import { Account, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserWithAccount extends User {
    accounts: Account[];
}

interface UserResponse extends ResponseType {
    profile: UserWithAccount;
}

export default function useUser() {
    const { data, error } = useSWR<UserResponse>("/api/users/me");
    const router = useRouter();

    useEffect(() => {
        if (data) {
            const { profile } = data;
            if (!data.ok) {
                router.replace("/auth/enter");
            } else if (
                data.ok &&
                !profile.accounts.length &&
                profile.email &&
                !profile.emailVerified &&
                router.pathname !== "/auth/checkEmail"
            ) {
                router.replace("/auth/checkEmail");
            }
        }
    }, [data, router]);

    return { user: data?.profile, isLoading: !data && !error };
}
