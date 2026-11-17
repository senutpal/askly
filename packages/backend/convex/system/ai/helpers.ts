"use node";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { internal } from "../../_generated/api";
import type { ActionCtx } from "../../_generated/server";
import { GEMINI_EMBEDDING_MODEL } from "./constants";

export async function getGoogleAIApiKey(
	ctx: ActionCtx,
	organizationId: string,
): Promise<string> {
	try {
		const secret = await ctx.runAction(
			internal.system.secrets.getByOrganizationIdAndService,
			{
				organizationId,
				service: "google-ai",
			},
		);

		if (secret && typeof secret === "string") {
			return secret;
		}
	} catch {
		throw new Error(
			"Gemini API key not configured. Please configure your API key in Settings → Plugins → Google AI.",
		);
	}

	throw new Error(
		"Gemini API key not configured. Please configure your API key in Settings → Plugins → Google AI.",
	);
}

export async function createGoogleAI(
	ctx: ActionCtx,
	organizationId: string,
	model: string,
): Promise<ReturnType<ReturnType<typeof createGoogleGenerativeAI>>> {
	const apiKey = await getGoogleAIApiKey(ctx, organizationId);
	const google = createGoogleGenerativeAI({ apiKey });
	return google(model);
}

export async function createGoogleTextEmbedding(
	ctx: ActionCtx,
	organizationId: string,
	model = GEMINI_EMBEDDING_MODEL,
): Promise<
	ReturnType<ReturnType<typeof createGoogleGenerativeAI>["textEmbedding"]>
> {
	const apiKey = await getGoogleAIApiKey(ctx, organizationId);
	const google = createGoogleGenerativeAI({ apiKey });
	return google.textEmbedding(model);
}
