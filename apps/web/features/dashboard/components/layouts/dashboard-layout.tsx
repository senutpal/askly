import { AuthGuard } from "@/components/auth-guard";
import OrganizationGuard from "@/features/auth/components/components/organization-guard";
import { SidebarProvider } from "@workspace/ui";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/features/dashboard/components/components/dashboard-sidebar";
import { Provider } from "jotai";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <AuthGuard>
      <OrganizationGuard>
        <Provider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar />
            <main className="flex flex-1 flex-col">{children}</main>
          </SidebarProvider>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  );
};
