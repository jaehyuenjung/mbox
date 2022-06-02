import { useState } from "react";

interface UseMutationState<T> {
    loading: boolean;
    data?: T;
    error?: object;
    reset: () => void;
}

type Method = "POST" | "DELETE";

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T>(
    url: string,
    type: Method
): UseMutationResult<T> {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<undefined | T>(undefined);
    const [error, setError] = useState<undefined | any>(undefined);
    function mutation(data: any) {
        setLoading(true);
        return fetch(url, {
            method: type,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json().catch(() => {}))
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }
    function reset() {
        setLoading(false);
        setData(undefined);
        setError(undefined);
    }
    return [mutation, { loading, data, error, reset }];
}
