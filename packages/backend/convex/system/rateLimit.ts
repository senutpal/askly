import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { consumeRateLimits } from "../lib/rateLimit";

const bucketValidator = v.object({
	key: v.string(),
	limit: v.number(),
	windowMs: v.number(),
});

/**
 * Actions cannot write to the database directly, so they call this internal
 * mutation to charge rate-limit buckets. Keeping the counters in a table
 * (rather than in memory) makes limits correct across every isolate.
 */
export const consume = internalMutation({
	args: {
		key: v.string(),
		limit: v.number(),
		windowMs: v.number(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await consumeRateLimits(ctx, [{ key: args.key, rule: args }]);
		return null;
	},
});

export const consumeMany = internalMutation({
	args: {
		buckets: v.array(bucketValidator),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await consumeRateLimits(
			ctx,
			args.buckets.map((bucket) => ({
				key: bucket.key,
				rule: { limit: bucket.limit, windowMs: bucket.windowMs },
			})),
		);
		return null;
	},
});
