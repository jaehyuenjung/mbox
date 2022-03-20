/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["k.kakaocdn.net", "ssl.pstatic.net"],
    },
};

module.exports = nextConfig;
