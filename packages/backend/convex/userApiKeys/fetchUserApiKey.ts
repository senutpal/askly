"use node";

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { decrypt } from "./helpers";

export const fetchUserApiKey = action({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<string | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const apiKeyDoc = await ctx.runQuery(
      internal.system.getUserApiKey.getUserApiKey,
      {
        userId,
      }
    );
    if (!apiKeyDoc) return null;
    try {
      return decrypt({ iv: apiKeyDoc.iv, content: apiKeyDoc.secretContent });
    } catch (error) {
      console.error("Failed to decrypt API key for userId:", userId, error);
      throw new Error("Failed to decrypt API key");
    }
  },
});
