export function getProviderColor(provider: string | undefined) {
    return provider
        ? provider === "kakao"
            ? "bg-yellow-300"
            : provider === "naver"
            ? "bg-green-400"
            : "bg-blue-500"
        : "bg-gray-500";
}
