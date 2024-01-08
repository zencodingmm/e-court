/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '192.168.1.3',
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
