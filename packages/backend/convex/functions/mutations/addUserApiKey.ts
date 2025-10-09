"use node";
import { v } from "convex/values";
import { action, mutation, query } from "../../_generated/server";
import { decrypt, encrypt } from "../helpers/cryptoHelper";

export const addUserApiKey = action({
  args: { userId: v.id("users"), apiKey: v.string() },
  handler: async (ctx, args) => {
    const encrypted = encrypt(args.apiKey);

    await ctx.db.insert("userApiKeys", {
      userId: args.userId,
      secretContent: encrypted.content,
      iv: encrypted.iv,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const getUserApiKey = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("userApiKeys")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!record) return null;

    const decrypted = decrypt({ iv: record.iv, content: record.secretContent });
    return decrypted;
  },
});
