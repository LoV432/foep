/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'picsum.photos'
			},
			{
				hostname: `${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}`
			}
		]
	}
};

export default nextConfig;
