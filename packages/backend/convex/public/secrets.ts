import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";

export const getVapiSecrets = action({
	args: {
		contactSessionId: v.id("contactSessions"),
	},
	handler: async (ctx, args) => {
		const contactSession = (await ctx.runQuery(
			internal.system.contactSessions.getOne,
			{ contactSessionId: args.contactSessionId },
		)) as { organizationId: string; expiresAt: number } | null;

		if (!contactSession || contactSession.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Session",
			});
		}

		// Organization is derived from the validated session, never from the caller.
		const organizationId = contactSession.organizationId;

		const plugin = (await ctx.runAction(
			internal.system.secrets.getByOrganizationIdAndService,
			{
				organizationId,
				service: "vapi",
			},
		)) as { privateApiKey: string; publicApiKey: string } | null;

		if (!plugin) {
			throw new ConvexError({ code: "NOT_FOUND", message: "Plugin Not Found" });
		}

		const { privateApiKey, publicApiKey } = plugin;

		if (!privateApiKey || !publicApiKey) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Credentials incomplete. Please reconnect your Vapi account",
			});
		}

		// Only the public key is returned; the private key is never exposed.
		return {
			publicApiKey: publicApiKey,
		};
	},
});
