"use client";
import type { MessageDoc } from "@convex-dev/agent";
import type { ThreadMessagesQuery } from "@convex-dev/agent/react";
import type {
	PaginatedQueryArgs,
	UsePaginatedQueryReturnType,
} from "convex/react";
import { usePaginatedQuery } from "convex-helpers/react/cache/hooks";

export function useCachedThreadMessages<
	Query extends ThreadMessagesQuery<unknown, MessageDoc>,
>(
	query: Query,
	args: PaginatedQueryArgs<Query> | "skip",
	options: { initialNumItems: number },
): UsePaginatedQueryReturnType<Query> {
	return usePaginatedQuery(query, args, {
		initialNumItems: options.initialNumItems,
		customPagination: true,
	});
}
