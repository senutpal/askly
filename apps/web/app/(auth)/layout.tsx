import { AuthLayout } from "@/features/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
