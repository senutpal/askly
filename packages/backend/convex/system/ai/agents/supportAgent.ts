import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import type { ActionCtx } from "../../../_generated/server";
import { GEMINI_MODEL, SUPPORT_AGENT_PROMPT } from "../constants";
import { createGoogleAI } from "../helpers";

export async function createSupportAgent(
	ctx: ActionCtx,
	organizationId: string,
) {
	const model = await createGoogleAI(ctx, organizationId, GEMINI_MODEL);

	return new Agent(components.agent, {
		name: "Askly",
		languageModel: model,
		instructions: SUPPORT_AGENT_PROMPT,
	});
}

const google = createGoogleGenerativeAI({ apiKey: "PLACEHOLDER_FOR_INIT" });
const defaultModel = google(GEMINI_MODEL);

export const supportAgent = new Agent(components.agent, {
	name: "Askly",
	languageModel: defaultModel,
	instructions: SUPPORT_AGENT_PROMPT,
});
