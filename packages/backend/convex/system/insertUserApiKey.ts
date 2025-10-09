import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const insertUserApiKey = internalMutation({
  args: {
    userId: v.id("users"),
    secretContent: v.string(),
    iv: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userApiKeys", args);
  },
});
