import { ResponseType } from "@libs/server/withHandler";
import { Account, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export interface UserWithAccount extends User {
    accounts: Account[];
}

interface UserResponse extends ResponseType {
    profile: UserWithAccount;
}

export default function useUser() {
    const { data, error, mutate } = useSWR<UserResponse>(`/api/users/me`);
    const router = useRouter();

    useEffect(() => {
        if (data) {
            const publicPath = ["/auth/enter", "/auth/register"];
            const { profile } = data;
            if (!data.ok && !publicPath.includes(router.pathname)) {
                router.replace("/auth/enter");
            } else if (
                data.ok &&
                profile.email &&
                !profile.accounts.length &&
                !profile.emailVerified &&
                !publicPath.includes(router.pathname) &&
                router.pathname !== "/auth/checkEmail"
            ) {
                router.replace("/auth/checkEmail");
            }
        }
    }, [data, router]);

    return { user: data?.profile, isLoading: !data && !error, mutate };
}
