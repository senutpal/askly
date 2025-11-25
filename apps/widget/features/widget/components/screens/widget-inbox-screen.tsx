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
		<div className="flex h-full flex-col bg-white">
			<WidgetHeader className="px-4 py-4">
				<div className="flex items-center gap-x-3">
					<Button
						onClick={() => setScreen("selection")}
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-full hover:bg-black/5"
					>
						<ArrowLeftIcon className="size-4 text-gray-600" />
					</Button>
					<span className="text-base font-semibold text-gray-900">Inbox</span>
				</div>
			</WidgetHeader>

			<div className="flex flex-1 flex-col overflow-y-auto bg-gray-50/50">
				{conversations?.results.length === 0 && (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground animate-in fade-in duration-500">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
							<ConversationStatusIcon status="resolved" className="size-6 text-gray-400" />
						</div>
						<p className="text-sm font-medium text-gray-500">No conversations yet</p>
					</div>
				)}
				{conversations?.results.length > 0 && (
					<div className="flex flex-col divide-y gap-3 mt-3 divide-gray-100">
						{conversations?.results.map((conversation) => (
							<Button
								key={conversation._id}
								className="group flex h-auto mr-4 ml-4 rounded-xl flex-col gap-1  border-0 bg-neutral-100 px-5 py-4 text-start transition-colors hover:bg-gray-300 active:bg-gray-200"
								onClick={() => {
									setConversationId(conversation._id);
									setScreen("chat");
								}}
								variant="ghost"
							>
								<div className="flex w-full items-center justify-between">
									<span className="text-xs font-medium text-gray-500">
										{formatDistanceToNow(new Date(conversation._creationTime), { addSuffix: true })}
									</span>
									<ConversationStatusIcon
										status={conversation.status}
										className="size-3.5 text-gray-400"
									/>
								</div>
								<p className="line-clamp-1 text-sm font-medium text-gray-900 w-full">
									{conversation.lastMessage?.text ?? "No messages yet"}
								</p>
							</Button>
						))}
					</div>
				)}
				<InfiniteScrollTrigger
					canLoadMore={canLoadMore}
					isLoadingMore={isLoadingMore}
					onLoadMore={handleLoadMore}
					ref={topElementRef}
				/>
			</div>

			<WidgetFooter />
		</div>
	);
};
