/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "k.kakaocdn.net",
            "ssl.pstatic.net",
            "platform-lookaside.fbsbx.com",
            "cdn.pixabay.com",
        ],
    },
};

module.exports = nextConfig;
