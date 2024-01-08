/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: process.env.NEXT_PUBLIC_BACKEND_HOST,
                port: '4000',
                pathname: '/**/*'
            }
        ]
    },
    webpack: config => {
        config.resolve.alias.canvas = false;

        return config;
    }
};

module.exports = nextConfig;
