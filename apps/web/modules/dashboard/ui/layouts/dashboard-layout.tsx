import { AuthGuard } from "@/components/auth-guard";
import OrganizationGuard from "@/modules/auth/ui/components/organization-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { Provider } from "jotai";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASKLY - Multilingual Campus AI Assistant",
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
