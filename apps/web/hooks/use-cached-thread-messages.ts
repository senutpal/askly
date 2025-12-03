"use client";
import {
  type BetterOmit,
  type Expand,
} from "convex-helpers";
import { usePaginatedQuery } from "convex-helpers/react/cache/hooks";
import {
  type PaginatedQueryArgs,
  type UsePaginatedQueryResult,
} from "convex/react";
import type {
  FunctionArgs,
  FunctionReference,
  PaginationOptions,
  PaginationResult,
} from "convex/server";
import { useMemo } from "react";
import { 
  useStreamingThreadMessages,
  type ThreadMessagesQuery as ImportedThreadMessagesQuery,
} from "@convex-dev/agent/react";

type SyncStreamsReturnValue = any;

type MessageStatus = "pending" | "success" | "error";
type Message = { role: string; content: string; [key: string]: any };
type StreamArgs = { startOrder?: number; skipStreamIds?: string[] };

export type MessageDocLike = {
  order: number;
  stepOrder: number;
  status: MessageStatus | "streaming";
  message?: Message;
};

export type ThreadMessagesQuery<
  Args = unknown,
  M extends MessageDocLike = MessageDocLike,
> = FunctionReference<
  "query",
  "public",
  {
    threadId: string;
    paginationOpts: PaginationOptions;
    streamArgs?: StreamArgs;
  } & Args,
  PaginationResult<M> & { streams?: SyncStreamsReturnValue }
>;

export type ThreadMessagesArgs<
  Query extends ThreadMessagesQuery<unknown, MessageDocLike>,
> =
  Query extends ThreadMessagesQuery<infer Args, MessageDocLike>
    ? Expand<BetterOmit<FunctionArgs<Query>, "paginationOpts" | "streamArgs">>
    : never;

export type ThreadMessagesResult<
  Query extends ThreadMessagesQuery<unknown, MessageDocLike>,
> = Query extends ThreadMessagesQuery<unknown, infer M> ? M : never;

export function useCachedThreadMessages<
  Query extends FunctionReference<"query", "public", any, any>,
>(
  query: Query,
  args: (Expand<BetterOmit<FunctionArgs<Query>, "paginationOpts" | "streamArgs">>) | "skip",
  options: {
    initialNumItems: number;
    stream?: boolean;
  },
): UsePaginatedQueryResult<
  any & { streaming: boolean; key: string }
> {
  const paginated = usePaginatedQuery(
    query,
    args as PaginatedQueryArgs<Query> | "skip",
    { initialNumItems: options.initialNumItems },
  );

  let startOrder = paginated.results.at(-1)?.order ?? 0;
  for (let i = paginated.results.length - 1; i >= 0; i--) {
    const m = paginated.results[i];
    if (m && !m.streaming && m.status === "pending") {
      startOrder = m.order - (m.order % 10);
      break;
    }
  }
  
  const streamMessages = useStreamingThreadMessages(
    query as any,
    !options.stream ||
      args === "skip" ||
      paginated.status === "LoadingFirstPage"
      ? "skip"
      : ({ ...args, paginationOpts: { cursor: null, numItems: 0 } } as any),
    { startOrder },
  );

  const threadId = args === "skip" ? undefined : args.threadId;

  const merged = useMemo(() => {
    const streamListMessages =
      streamMessages?.map((m: any) => ({
        ...m,
        streaming: !m.status || m.status === "pending",
      })) ?? [];
    const sorted = (items: any[]) => {
      return [...items].sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.stepOrder - b.stepOrder;
      });
    };
    
    return {
      ...paginated,
      results: sorted(
        paginated.results
          .map((m: any) => ({ ...m, streaming: false }))
          .concat(streamListMessages) as (MessageDocLike & {
          streaming: boolean;
          key: string;
        })[],
      ).reduce(
        (msgs: (MessageDocLike & { streaming: boolean; key: string })[], msg: MessageDocLike & { streaming: boolean; key: string }) => {
          msg.key = `${threadId}-${msg.order}-${msg.stepOrder}`;
          const last = msgs.at(-1);
          if (!last) {
            return [msg];
          }
          if (last.order !== msg.order || last.stepOrder !== msg.stepOrder) {
            return [...msgs, msg];
          }
          if (
            last.status === "pending" &&
            (msg.streaming || msg.status !== "pending")
          ) {
            return [...msgs.slice(0, -1), msg];
          }
          return msgs;
        },
        [] as (MessageDocLike & { streaming: boolean; key: string })[],
      ),
    };
  }, [paginated, streamMessages, threadId]);

  return merged as any;
}
