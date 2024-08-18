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
    },
    async redirects() {
        return [
            {
                source: '/about_services',
                destination: '/about_services/mrt',
                permanent: true,
            }
        ]
    },
};

export default nextConfig;
