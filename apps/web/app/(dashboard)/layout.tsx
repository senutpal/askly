import { DashboardLayout } from "@/features/dashboard/components/layouts/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
