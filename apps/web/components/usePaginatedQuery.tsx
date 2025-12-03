// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OptionalRestArgsOrSkip } from "convex/react";
import { FunctionReference, FunctionReturnType, FunctionArgs } from "convex/server";
import { useContext, useEffect, useMemo, useState, useCallback } from "react";

import { createQueryKey } from "./core";
import { ConvexQueryCacheContext } from "./QueryCache";

/**
 * PaginatedQueryResult mirrors the structure returned by Convex's usePaginatedQuery
 */
export type PaginatedQueryResult<T> = {
  results: T[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
};

type PaginationResult<T> = {
  page: T[];
  isDone: boolean;
  continueCursor: string | null;
};

type CachedPaginatedQuery<T> = {
  results: T[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  continueCursor: string | null;
  refs: Set<string>;
  evictTimer: number | null;
  unsub?: () => void;
  loadingMore: boolean;
};

/**
 * Load a reactive paginated query within a React component with caching.
 *
 * This React hook contains internal state that will cause a rerender
 * whenever the query result changes, and caches results across component mounts.
 *
 * Throws an error if not used under ConvexProvider and ConvexQueryCacheProvider.
 *
 * @param query - a FunctionReference for the public query to run
 * @param args - The arguments to the query function or the string "skip" if the
 * query should not be loaded.
 * @param options - Pagination options (initialNumItems)
 * @returns the paginated result of the query with results, status, and loadMore function.
 *
 * @public
 */
export function usePaginatedQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: any,
  options: { initialNumItems: number }
): PaginatedQueryResult<FunctionReturnType<Query> extends PaginationResult<infer T> ? T : never> {
  type ItemType = FunctionReturnType<Query> extends PaginationResult<infer T> ? T : never;
  
  let skipping = false;
  const memoizedArgs = useMemo(() => args, [args]);
  
  if (memoizedArgs === "skip") {
    skipping = true;
  }

  const queryKey = skipping ? undefined : createQueryKey(query, memoizedArgs as any);
  const { registry } = useContext(ConvexQueryCacheContext);
  
  const [result, setResult] = useState<{
    results: ItemType[];
    status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  }>(() => {
    if (registry === null || queryKey === undefined) {
      return {
        results: [],
        status: "LoadingFirstPage" as const,
      };
    }
    
    // Initialize paginated cache on registry if it doesn't exist
    if (!(registry as any).paginatedCache) {
      (registry as any).paginatedCache = new Map<string, CachedPaginatedQuery<any>>();
    }
    
    const cacheKey = `paginated:${queryKey}`;
    const cachedEntry = (registry as any).paginatedCache.get(cacheKey) as CachedPaginatedQuery<ItemType> | undefined;
    
    if (cachedEntry && cachedEntry.results.length > 0) {
      return {
        results: cachedEntry.results,
        status: cachedEntry.status,
      };
    }
    
    return {
      results: [],
      status: "LoadingFirstPage" as const,
    };
  });

  if (registry === null) {
    throw new Error(
      "Could not find `ConvexQueryCacheContext`! This `usePaginatedQuery` implementation must be used in the React component " +
        "tree under `ConvexQueryCacheProvider`. Did you forget it? "
    );
  }

  const loadMore = useCallback((numItems: number) => {
    if (queryKey === undefined || registry === null) return;
    
    const cacheKey = `paginated:${queryKey}`;
    const paginatedCache = (registry as any).paginatedCache as Map<string, CachedPaginatedQuery<ItemType>>;
    const cachedEntry = paginatedCache.get(cacheKey);
    
    if (cachedEntry && cachedEntry.status === "CanLoadMore" && !cachedEntry.loadingMore) {
      cachedEntry.loadingMore = true;
      cachedEntry.status = "LoadingMore";
      
      // Notify all subscribers of loading state
      setResult({
        results: cachedEntry.results,
        status: "LoadingMore",
      });
      
      // Unsubscribe from current query
      cachedEntry.unsub?.();
      
      // Create new query with pagination cursor
      const paginationArgs = typeof memoizedArgs === 'object' && memoizedArgs !== null 
        ? { ...(memoizedArgs as Record<string, unknown>), paginationOpts: { numItems, cursor: cachedEntry.continueCursor } }
        : { paginationOpts: { numItems, cursor: cachedEntry.continueCursor } };
      
      const w = registry.convex.watchQuery(query, paginationArgs as any);
      
      const unsub = w.onUpdate(() => {
        const queryResult = w.localQueryResult() as PaginationResult<ItemType> | undefined;
        
        if (queryResult) {
          const entry = paginatedCache.get(cacheKey);
          if (entry) {
            // Append new results
            entry.results = [...entry.results, ...queryResult.page];
            entry.continueCursor = queryResult.continueCursor;
            entry.status = queryResult.isDone ? "Exhausted" : "CanLoadMore";
            entry.loadingMore = false;
            
            // Notify all subscribers
            for (const ref of entry.refs.values()) {
              const subscriber = (registry as any).paginatedSubs?.get(ref);
              if (subscriber?.setter) {
                subscriber.setter({
                  results: entry.results,
                  status: entry.status,
                });
              }
            }
          }
        }
      });
      
      cachedEntry.unsub = unsub;
    }
  }, [queryKey, registry, query, memoizedArgs]);

  useEffect(() => {
    if (queryKey === undefined || skipping) {
      return;
    }

    const id = crypto.randomUUID();
    const cacheKey = `paginated:${queryKey}`;
    
    // Initialize paginated cache if not exists
    if (!(registry as any).paginatedCache) {
      (registry as any).paginatedCache = new Map<string, CachedPaginatedQuery<ItemType>>();
    }
    
    const paginatedCache = (registry as any).paginatedCache as Map<string, CachedPaginatedQuery<ItemType>>;
    
    let entry = paginatedCache.get(cacheKey);
    
    if (entry === undefined) {
      // Create new entry and subscribe to Convex
      entry = {
        results: [],
        status: "LoadingFirstPage",
        continueCursor: null,
        refs: new Set(),
        evictTimer: null,
        loadingMore: false,
      };
      
      // Use the convex client to watch the query
      const paginationArgs = typeof memoizedArgs === 'object' && memoizedArgs !== null 
        ? { ...(memoizedArgs as Record<string, unknown>), paginationOpts: { numItems: options.initialNumItems, cursor: null } }
        : { paginationOpts: { numItems: options.initialNumItems, cursor: null } };
      
      const w = registry.convex.watchQuery(query, paginationArgs as any);
      
      const unsub = w.onUpdate(() => {
        const queryResult = w.localQueryResult() as PaginationResult<ItemType> | undefined;
        
        if (queryResult) {
          const e = paginatedCache.get(cacheKey);
          if (e) {
            e.results = queryResult.page;
            e.continueCursor = queryResult.continueCursor;
            e.status = queryResult.isDone ? "Exhausted" : "CanLoadMore";
            e.loadingMore = false;
            
            // Notify all subscribers
            for (const ref of e.refs.values()) {
              const subscriber = (registry as any).paginatedSubs?.get(ref);
              if (subscriber?.setter) {
                subscriber.setter({
                  results: e.results,
                  status: e.status,
                });
              }
            }
          }
        }
      });
      
      entry.unsub = unsub;
      paginatedCache.set(cacheKey, entry);
    } else if (entry.evictTimer !== null) {
      // Clear eviction timer if entry is being reused
      clearTimeout(entry.evictTimer);
      entry.evictTimer = null;
    }
    
    // Add this component as a ref
    entry.refs.add(id);
    
    // Store subscriber info
    if (!(registry as any).paginatedSubs) {
      (registry as any).paginatedSubs = new Map();
    }
    
    (registry as any).paginatedSubs.set(id, {
      queryKey: cacheKey,
      setter: setResult,
    });
    
    // Update with current value if available
    if (entry.results.length > 0 || entry.status !== "LoadingFirstPage") {
      setResult({
        results: entry.results,
        status: entry.status,
      });
    }
    
    return () => {
      // Cleanup subscription
      const entry = paginatedCache.get(cacheKey);
      if (entry) {
        entry.refs.delete(id);
        
        // If no more refs, schedule for eviction
        if (entry.refs.size === 0) {
          const timeout = (registry as any).timeout || 300000; // 5 minutes default
          entry.evictTimer = setTimeout(() => {
            entry.unsub?.();
            paginatedCache.delete(cacheKey);
          }, timeout) as unknown as number;
        }
      }
      
      (registry as any).paginatedSubs?.delete(id);
    };
  }, [registry, queryKey, skipping, query, memoizedArgs, options.initialNumItems]);

  return {
    results: result.results,
    status: result.status,
    loadMore,
    isLoading: result.status === "LoadingFirstPage" || result.status === "LoadingMore",
  };
}

