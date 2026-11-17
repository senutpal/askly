"use client";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@workspace/ui";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useParams } from "next/navigation";
import { ContactPanel } from "../contact-panel";

export const ConversationIdLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const params = useParams();
	const conversationId = params.conversationId as
		| Id<"conversations">
		| undefined;

	const conversation = useQuery(
		api.private.conversations.getOne,
		conversationId ? { conversationId } : "skip",
	);

	return (
		<ResizablePanelGroup className="h-full flex-1" direction="horizontal">
			<ResizablePanel className="h-full" defaultSize={60}>
				<div className="flex h-full flex-1 flex-col">{children}</div>
			</ResizablePanel>
			<ResizableHandle className="hidden lg:block" />
			<ResizablePanel defaultSize={40} maxSize={40} minSize={20}>
				<ContactPanel contactSession={conversation?.contactSession} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
