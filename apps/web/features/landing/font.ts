import localFont from "next/font/local";

export const inter = localFont({
	src: "./fonts/inter-latin-variable.woff2",
	weight: "100 900",
	display: "swap",
	fallback: ["Arial", "sans-serif"],
	adjustFontFallback: "Arial",
	variable: "--font-landing",
});
