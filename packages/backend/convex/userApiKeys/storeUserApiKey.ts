"use node";

import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { action } from "../_generated/server";
import { encrypt } from "./helpers";


export const storeUserApiKey = action({
  args: { userId: v.id("users"), apiKey: v.string() },
  handler: async (ctx, { userId, apiKey }) => {
    const { content, iv } = encrypt(apiKey);
    await ctx.runMutation(internal.system.insertUserApiKey.insertUserApiKey, {
      userId,
      secretContent: content,
      iv,
      createdAt: Date.now(),
    });
  },
});
