import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";
import {
	isVapiCredentials,
	type VapiCredentials,
	vapiSecretsValidator,
} from "../lib/validators";

export const getVapiSecrets = action({
	args: {
		contactSessionId: v.id("contactSessions"),
	},
	returns: vapiSecretsValidator,
	handler: async (ctx, args): Promise<{ publicApiKey: string }> => {
		const contactSession: Doc<"contactSessions"> | null = await ctx.runQuery(
			internal.system.contactSessions.getOne,
			{ contactSessionId: args.contactSessionId },
		);

		if (!contactSession || contactSession.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Session",
			});
		}

		// Organization is derived from the validated session, never from the caller.
		const organizationId = contactSession.organizationId;

		const secret: string | VapiCredentials = await ctx.runAction(
			internal.system.secrets.getByOrganizationIdAndService,
			{
				organizationId,
				service: "vapi",
			},
		);

		if (!isVapiCredentials(secret)) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Credentials incomplete. Please reconnect your Vapi account",
			});
		}

		// Only the public key is returned; the private key is never exposed.
		return {
			publicApiKey: secret.publicApiKey,
		};
	},
});
