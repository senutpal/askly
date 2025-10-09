import { internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const getUserApiKey = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("userApiKeys")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
  },
});
