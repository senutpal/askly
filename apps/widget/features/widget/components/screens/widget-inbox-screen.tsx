"use client";

import { api } from "@workspace/backend/_generated/api";
import {
	Button,
	ConversationStatusIcon,
	InfiniteScrollTrigger,
	useInfiniteScroll,
} from "@workspace/ui";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon } from "lucide-react";
import {
	contactSessionIdAtomFamily,
	conversationIdAtom,
	organizationIdAtom,
	screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetInboxScreen = () => {
	const setScreen = useSetAtom(screenAtom);
	const setConversationId = useSetAtom(conversationIdAtom);

	const organizationId = useAtomValue(organizationIdAtom);
	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || ""),
	);

	const conversations = usePaginatedQuery(
		api.public.conversations.getMany,
		contactSessionId ? { contactSessionId } : "skip",
		{ initialNumItems: 20 },
	);
	const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
		useInfiniteScroll({
			status: conversations.status,
			loadMore: conversations.loadMore,
			loadSize: 10,
		});

	return (
		<>
			<WidgetHeader>
				<div className="flex items-center gap-x-2">
					<Button
						onClick={() => setScreen("selection")}
						variant="transparent"
						size="icon"
					>
						<ArrowLeftIcon />
					</Button>
					<p>Inbox</p>
				</div>
			</WidgetHeader>

			<div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
				{" "}
				{conversations?.results.length === 0 && (
					<div className="flex flex-1 items-center justify-center text-muted-foreground">
						<p className="text-sm">No conversations yet</p>
					</div>
				)}
				{conversations?.results.length > 0 &&
					conversations?.results.map((conversation) => (
						<Button
							key={conversation._id}
							className="h-20 w-full justify-between"
							onClick={() => {
								setConversationId(conversation._id);
								setScreen("chat");
							}}
							variant="outline"
						>
							<div className="flex w-full flex-col gap-4 overflow-hidden text-start">
								<div className="flex w-full items-center justify-between gap-x-2">
									<p className="text-xs text-muted-foreground">Chat</p>
									<p className="text-xs text-muted-foreground">
										{formatDistanceToNow(new Date(conversation._creationTime))}
									</p>
								</div>
								<div className="flex w-full items-center justify-between gap-x-2">
									<p className="truncate text-sm">
										{conversation.lastMessage?.text ?? "No messages yet"}
									</p>
									<ConversationStatusIcon
										status={conversation.status}
										className="shrink-0"
									/>
								</div>
							</div>
						</Button>
					))}
				<InfiniteScrollTrigger
					canLoadMore={canLoadMore}
					isLoadingMore={isLoadingMore}
					onLoadMore={handleLoadMore}
					ref={topElementRef}
				/>
			</div>

			<WidgetFooter />
		</>
	);
};
