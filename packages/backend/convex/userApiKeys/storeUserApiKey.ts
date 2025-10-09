"use node";

import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { action } from "../_generated/server";
import { encrypt } from "./helpers";

export const storeUserApiKey = action({
  args: { userId: v.id("users"), apiKey: v.string() },
  handler: async (ctx, { userId, apiKey }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    if (identity.subject !== userId) {
      throw new Error("Unauthorized: cannot store API key for another user");
    }

    if (!apiKey || apiKey.length < 32) {
      throw new Error("API key must be at least 32 characters");
    }
    const existing = await ctx.runQuery(
      internal.system.getUserApiKey.getUserApiKey,
      { userId }
    );
    if (existing) {
      throw new Error("API key already exists for this user");
    }
    const { content, iv } = encrypt(apiKey);
    await ctx.runMutation(internal.system.insertUserApiKey.insertUserApiKey, {
      userId,
      secretContent: content,
      iv,
      createdAt: Date.now(),
    });
  },
});
