import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { AuthLayout, OrgSelectionView } from "@/features/auth";
import { DashboardLayout, OverviewView } from "@/features/dashboard";
import {
	LANDING_DESCRIPTION,
	LANDING_OG_IMAGE,
	LANDING_OG_IMAGE_ALT,
	LANDING_TITLE,
	LandingPage,
	SITE_URL,
} from "@/features/landing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: { absolute: LANDING_TITLE },
	description: LANDING_DESCRIPTION,
	alternates: { canonical: `${SITE_URL}/` },
	icons: { icon: "/logo.svg" },
	openGraph: {
		type: "website",
		siteName: "Askly",
		title: LANDING_TITLE,
		description: LANDING_DESCRIPTION,
		url: `${SITE_URL}/`,
		images: [
			{
				url: LANDING_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: LANDING_OG_IMAGE_ALT,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: LANDING_TITLE,
		description: LANDING_DESCRIPTION,
		images: [LANDING_OG_IMAGE],
	},
};

const HomePage = async () => {
	const { userId, orgId } = await auth();

	if (!userId) {
		return <LandingPage />;
	}

	if (!orgId) {
		return (
			<AuthLayout>
				<OrgSelectionView />
			</AuthLayout>
		);
	}

	return (
		<DashboardLayout>
			<OverviewView />
		</DashboardLayout>
	);
};

export default HomePage;
