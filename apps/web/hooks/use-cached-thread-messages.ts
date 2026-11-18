"use client";
import type { MessageDoc } from "@convex-dev/agent";
import {
	type ThreadMessagesQuery,
	useThreadMessages,
} from "@convex-dev/agent/react";

type CachedThreadMessagesArgs<
	Query extends ThreadMessagesQuery<unknown, MessageDoc>,
> = Parameters<typeof useThreadMessages<Query>>[1];

type CachedThreadMessagesResult<
	Query extends ThreadMessagesQuery<unknown, MessageDoc>,
> = ReturnType<typeof useThreadMessages<Query>>;

export function useCachedThreadMessages<
	Query extends ThreadMessagesQuery<unknown, MessageDoc>,
>(
	query: Query,
	args: CachedThreadMessagesArgs<Query>,
	options: { initialNumItems: number },
): CachedThreadMessagesResult<Query> {
	return useThreadMessages(query, args, options);
}
