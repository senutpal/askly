import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "@workspace/ui/styles/globals.css";
import "../styles/mobile-optimizations.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
	title: "Askly",
	description:
		"Revolutionize campus communication with AI-powered multilingual chatbot support in Hindi, English, and regional languages. 24/7 automated student assistance.",
	keywords: [
		"campus chatbot",
		"multilingual AI",
		"student support",
		"educational technology",
		"conversational AI",
	],
	openGraph: {
		title: "ASKLY - Multilingual Campus AI Assistant",
		description:
			"Transform campus communication with intelligent multilingual chatbot support",
		type: "website",
	},
};

const dmSans = DM_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-sans",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="scroll-smooth">
			<body
				className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
