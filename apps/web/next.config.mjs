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
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
	},

	// Enable experimental features for better performance
	experimental: {
		optimizePackageImports: ["@workspace/ui", "motion", "lucide-react"],
	},

	// Production optimizations
	reactStrictMode: true,

	// Disable ESLint during builds (using Biome for linting)
	eslint: {
		ignoreDuringBuilds: true,
	},

	// Performance budgets (will log warnings)
	onDemandEntries: {
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},
};

export default nextConfig;
