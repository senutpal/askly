import { VapiClient } from "@vapi-ai/server-sdk";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import type { ActionCtx } from "../_generated/server";
import { authedAction } from "../lib/functions";
import {
	isVapiCredentials,
	type VapiCredentials,
	vapiAssistantValidator,
	vapiPhoneNumberValidator,
} from "../lib/validators";

const getVapiClient = async (
	ctx: ActionCtx,
	organizationId: string,
): Promise<VapiClient> => {
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

	return new VapiClient({ token: secret.privateApiKey });
};

export const getPhoneNumbers = authedAction({
	args: {},
	returns: v.array(vapiPhoneNumberValidator),
	handler: async (ctx) => {
		const vapiClient = await getVapiClient(ctx, ctx.orgId);
		const phoneNumbers = await vapiClient.phoneNumbers.list();

		return phoneNumbers.map((phoneNumber) => ({
			id: phoneNumber.id,
			...(phoneNumber.number ? { number: phoneNumber.number } : {}),
			...(phoneNumber.name ? { name: phoneNumber.name } : {}),
			...(phoneNumber.status ? { status: phoneNumber.status } : {}),
		}));
	},
});

export const getAssistants = authedAction({
	args: {},
	returns: v.array(vapiAssistantValidator),
	handler: async (ctx) => {
		const vapiClient = await getVapiClient(ctx, ctx.orgId);
		const assistants = await vapiClient.assistants.list();

		return assistants.map((assistant) => ({
			id: assistant.id,
			...(assistant.name ? { name: assistant.name } : {}),
			model: assistant.model?.model ?? null,
			...(assistant.firstMessage
				? { firstMessage: assistant.firstMessage }
				: {}),
		}));
	},
});
