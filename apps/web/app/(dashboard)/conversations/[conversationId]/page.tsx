import type { Id } from "@workspace/backend/_generated/dataModel";
import { ConversationIdView } from "@/features/dashboard/components/views/conversation-id-view";

const Page = async ({
	params,
}: {
	params: Promise<{ conversationId: string }>;
}) => {
	const { conversationId } = await params;

	return (
		<div>
			<ConversationIdView
				conversationId={conversationId as Id<"conversations">}
			/>
		</div>
	);
};

export default Page;
