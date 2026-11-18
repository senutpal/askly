"use node";

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import {
	isVapiCredentials,
	pluginServiceValidator,
	secretValidator,
} from "../lib/validators";
import { decrypt, encrypt } from "../userApiKeys/helpers";

export const upsert = internalAction({
	args: {
		organizationId: v.string(),
		service: pluginServiceValidator,
		text: secretValidator,
	},
	returns: v.object({
		status: v.string(),
	}),
	handler: async (ctx, args) => {
		const textToEncrypt =
			typeof args.text === "string" ? args.text : JSON.stringify(args.text);

		const { content, iv, authTag } = encrypt(textToEncrypt);
		await ctx.runMutation(internal.system.plugins.upsert, {
			service: args.service,
			secretContent: content,
			iv,
			authTag,
			organizationId: args.organizationId,
		});
		return { status: "success" };
	},
});

export const getByOrganizationIdAndService = internalAction({
	args: {
		organizationId: v.string(),
		service: pluginServiceValidator,
	},
	returns: secretValidator,
	handler: async (ctx, args) => {
		const encrypted = await ctx.runQuery(
			internal.system.plugins.getByOrganizationIdAndService,
			{
				service: args.service,
				organizationId: args.organizationId,
			},
		);
		if (!encrypted) {
			throw new Error("Plugin not found");
		}
		const { secretContent, iv, authTag } = encrypted;

		const decrypted = decrypt(iv, secretContent, authTag);

		try {
			const parsed: unknown = JSON.parse(decrypted);

			if (typeof parsed === "string") {
				return parsed;
			}

			return isVapiCredentials(parsed) ? parsed : decrypted;
		} catch {
			return decrypted;
		}
	},
});
