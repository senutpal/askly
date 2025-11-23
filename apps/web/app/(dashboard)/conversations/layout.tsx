import { ConversationsLayout } from "@/features/dashboard/components/layouts/conversations-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return <ConversationsLayout>{children}</ConversationsLayout>;
};

export default Layout;
