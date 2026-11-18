import { SidebarProvider } from "@workspace/ui";
import { Provider } from "jotai";
import { AuthGuard } from "@/components/auth-guard";
import { OrganizationGuard } from "@/features/auth";
import { DashboardSidebar } from "@/features/dashboard";

export const DashboardLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<AuthGuard>
			<OrganizationGuard>
				<Provider>
					<SidebarProvider defaultOpen={true}>
						<DashboardSidebar />
						<main className="flex flex-1 flex-col">{children}</main>
					</SidebarProvider>
				</Provider>
			</OrganizationGuard>
		</AuthGuard>
	);
};
