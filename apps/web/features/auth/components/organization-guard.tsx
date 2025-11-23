"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "@/features/auth/components/layouts/auth-layout";
import { OrgSelectionView } from "@/features/auth/components/views/org-selection-view";

export const OrganizationGuard = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { organization, isLoaded } = useOrganization();

	if (!isLoaded) {
		return (
			<AuthLayout>
				<div>Loading...</div>
			</AuthLayout>
		);
	}

	if (!organization) {
		return (
			<AuthLayout>
				<OrgSelectionView />
			</AuthLayout>
		);
	}
	return <AuthLayout>{children}</AuthLayout>;
};
