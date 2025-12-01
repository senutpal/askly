import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import type { ActionCtx } from "../../../_generated/server";
import { SUPPORT_AGENT_PROMPT } from "../constants";
import { createGoogleAI } from "../helpers";

export async function createSupportAgent(
	ctx: ActionCtx,
	organizationId: string,
) {
	const model = await createGoogleAI(ctx, organizationId, "gemini-2.5-flash");

	return new Agent(components.agent, {
		name: "Askly",
		languageModel: model,
		instructions: SUPPORT_AGENT_PROMPT,
	});
}

const google = createGoogleGenerativeAI({ apiKey: "PLACEHOLDER_FOR_INIT" });
const defaultModel = google("gemini-2.5-flash");

export const supportAgent = new Agent(components.agent, {
	name: "Askly",
	languageModel: defaultModel,
	instructions: SUPPORT_AGENT_PROMPT,
});
