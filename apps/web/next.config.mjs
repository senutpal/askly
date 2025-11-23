/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@workspace/ui"],

	// Performance optimizations
	compiler: {
		// Remove console.log in production
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
	},

	// Optimize images
	images: {
		formats: ["image/webp", "image/avif"],
	},

	// Enable experimental features for better performance
	experimental: {
		optimizePackageImports: ["@workspace/ui", "motion"],
	},

	// Production optimizations
	reactStrictMode: true,
};

export default nextConfig;
