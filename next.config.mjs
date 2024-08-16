/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ipcam2.numedy.com'
            },
            {
                protocol: 'https',
                hostname: 'ipcam3.numedy.com'
            },
        ],
    }
};

export default nextConfig;
