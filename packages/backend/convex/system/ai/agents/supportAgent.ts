import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import type { ActionCtx } from "../../../_generated/server";
import { DEFAULT_AI_MODEL } from "../../../lib/aiProviders";
import { getOrganizationLanguageModel } from "../config";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export async function createSupportAgent(
	ctx: ActionCtx,
	organizationId: string,
) {
	const { model } = await getOrganizationLanguageModel(ctx, organizationId);

	return new Agent(components.agent, {
		name: "Askly",
		languageModel: model,
		instructions: SUPPORT_AGENT_PROMPT,
	});
}

const google = createGoogleGenerativeAI({ apiKey: "PLACEHOLDER_FOR_INIT" });
const defaultModel = google(DEFAULT_AI_MODEL);

export const supportAgent = new Agent(components.agent, {
	name: "Askly",
	languageModel: defaultModel,
	instructions: SUPPORT_AGENT_PROMPT,
});
