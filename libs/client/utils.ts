export function cls(...classname: string[]) {
    return classname.join(" ");
}

export function getProviderColor(provider: string | undefined) {
    return provider
        ? provider === "kakao"
            ? "bg-yellow-300"
            : provider === "naver"
            ? "bg-green-400"
            : "bg-blue-800"
        : "bg-gray-500";
}

export const convertURLtoFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
    const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것
    const metadata = { type: `image/${ext}` };
    return new File([data], filename!, metadata);
};
